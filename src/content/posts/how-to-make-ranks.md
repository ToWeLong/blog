---
title: 如何实现一个排行榜？
pubDate: 2024-09-30
categories: ['golang', '技术方案']
---

> 最近项目上有个需求是根据账号所获得的积分来做一个全局的积分排行榜，并且要求同积分时先达到的排名靠前，而不是并列排名，只取前10名的数据，活动时间不会持续太久，一个月左右。

## 技术方案选型
前置要求（2C4G1副本）：
- 响应时间：接口平均响应时间均小于500ms，99%响应时间均小于1s。
- TPS：场景TPS均大于1K，满足性能需求。
- 资源使用：每个场景执行完之后，CPU、内存会慢慢恢复至执行前状态，符合正常情况，满足性能需求。
- 错误率：各场景执行过程中，接口错误率为0。

### 1. 基于数据库实现排行榜

由于大多数项目都是采用关系型数据库MySQL，以下以MySQL举例。

首先，排序很容易想到用order by score, update_time，然后
取 limit 10，这样就能拿到前10名的数据，然后需要提升性能需要对score, update_time 加索引。

最后总结一下：
- 优点：
	- 1.开发速度快
    - 2.开发量少
    - 3.无需引入其他中间件
- 缺点：
    - 1.数据量大了，数据库容易成为瓶颈


### 2. 基于Redis实现排行榜

Redis中有一个数据结构是有序集合（sorted set），有序且不重复，数据结构大致如下图所示：
![有序集合](/1f85c32db0bb35a0f3e9dcd56c8c0540.png)

前面是Redis Key: project:rank:202410，后面是集合的内容，score表示分数，类型浮点型；member表示成员，不可重复。

这个结构有几个特点，一是可排序，而是同分数按字典序排序，如升序情况下同分，有member: a和b，那么a在b的前面。

但是需求里面说同分需要先到达者排上面，这样的话，Redis基本的排序功能就用不了，那如何巧妙实现这个要求呢？那跟时间有关就只能从时间下手，首先能想到的是时间戳，但是分数+时间戳来排序好像也不太行，因为后到者的时间戳肯定更大，加起来的和必然也是更大的。

演示：

同分：score   10位的时间戳：t1 t2 （t1 < t2）

得出 score + t1 < score + t2 ,因此就不对了。

那换个思路做减法，score + （9999999999 - t1）>score + （9999999999 - t2），这样就实现了。 但是这样的话分数就丢失了，最后我们还是需要展示积分数的，那直接将 时间部分转为小数再加上分数，到最终展示分数的时候将整个分数转为int类型，这样就完美解决了。

```go
func (s *ScoreRankService) GetFloatScore(score int) (float64, error) {
	point := 9999999999 - time.Now().Unix()
	floatScoreStr := strconv.Itoa(score) + "." + strconv.FormatInt(point, 10)
	return strconv.ParseFloat(floatScoreStr, 64)
}
```

为了避免排行榜数据量过于庞大，我在此做了两个优化，限制排行榜的总数，找出排行榜最后一名成员，如果新成员的分数大于最后一名成员的分数，我们再插入。

```go
func (s *ScoreRankService) InsertMember(ctx context.Context, memberKey string, score int) error {
	floatScore, err := s.GetFloatScore(score)
	if err != nil {
		return err
	}
	// 是否需要插入排行榜
	isNeedInsert := false
	// 获取当前排行榜的数量
	count, err := s.GetScoreRankCount(ctx)
	if err != nil {
		return err
	}
	if count < s.Count+10 { // 数量不足插入
		isNeedInsert = true
	} else {
		lastScore, err := s.GetLastMemberScore(ctx)
		if err != nil {
			return err
		}
		if score > lastScore {
			isNeedInsert = true
		}
	}

	if isNeedInsert {
		_, err = s.Rdb.ZAdd2(ctx, s.Key, &redis2.Z{
			Score:  floatScore,
			Member: memberKey,
		})
		if err != nil {
			return err
		}
	}

	return nil
}
```

### 完整示例代码（go）
```go
type ScoreRankService struct {
	Rdb   *redis.Pools
	Key   string // 排行榜key
	Count int64  // 排行榜数量
}

func NewScoreRankService(rdb *redis.Pools, key string, count int64) *ScoreRankService {
	return &ScoreRankService{Rdb: rdb, Key: key, Count: count}
}

func (s *ScoreRankService) InsertMember(ctx context.Context, memberKey string, score int) error {
	floatScore, err := s.GetFloatScore(score)
	if err != nil {
		return err
	}
	// 是否需要插入排行榜
	isNeedInsert := false
	// 获取当前排行榜的数量
	count, err := s.GetScoreRankCount(ctx)
	if err != nil {
		return err
	}
	if count < s.Count+10 { // 数量不足插入
		isNeedInsert = true
	} else {
		lastScore, err := s.GetLastMemberScore(ctx)
		if err != nil {
			return err
		}
		if score > lastScore {
			isNeedInsert = true
		}
	}

	if isNeedInsert {
		_, err = s.Rdb.ZAdd2(ctx, s.Key, &redis2.Z{
			Score:  floatScore,
			Member: memberKey,
		})
		if err != nil {
			return err
		}
	}

	return nil
}

// GetMemberList 获取排行榜列表
func (s *ScoreRankService) GetMemberList(ctx context.Context) ([]redis2.Z, error) {
	list := make([]redis2.Z, 0, s.Count)
	scores, err := s.Rdb.ZRevRangeWithScores(ctx, s.Key, 0, -1)
	if err != nil {
		return list, err
	}
	if len(scores) == 0 {
		return list, nil
	}
	if len(scores) > int(s.Count) {
		scores = scores[:s.Count]
	}
	return scores, nil
}

func (s *ScoreRankService) GetFloatScore(score int) (float64, error) {
	point := 9999999999 - time.Now().Unix()
	floatScoreStr := strconv.Itoa(score) + "." + strconv.FormatInt(point, 10)
	return strconv.ParseFloat(floatScoreStr, 64)
}

func (s *ScoreRankService) GetScoreRankCount(ctx context.Context) (int64, error) {
	card, err := s.Rdb.ZCard(ctx, s.Key)
	if err != nil {
		return 0, err
	}
	return card, nil
}

// GetLastMemberScore 获取最后一个成员的分数
func (s *ScoreRankService) GetLastMemberScore(ctx context.Context) (int, error) {
	members, err := s.Rdb.ZRevRangeWithScores(ctx, s.Key, -1, -1)
	if err != nil {
		return 0, err
	}
	if len(members) == 0 {
		return 0, nil
	}
	return int(members[0].Score), nil
}
```

最后总结一下：
- 优点：
	- 1.大部分场景下实时排序效率都要高于数据库排序。
    - 2.实现代码稍多。
- 缺点：
    - 1.引入了其他中间件。
    - 2.存在Redis故障后排行榜无数据的风险。

## 参考

1.https://blog.csdn.net/u022812849/article/details/126459623


