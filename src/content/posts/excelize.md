---
title: 讲一讲Golang中excelize的几种用法
pubDate: 2024-02-18
categories: ['golang']
---

# 讲一讲 Golang 中 excelize 的几种用法

`excelize`[^1]是 golang 中一个操作`excel`的库，有点类似于 Java 生态中阿里巴巴开源的`EasyExcel`[^2]。

## 导出

### 1. 直接生成 excel 文件

> 应用场景：常用于脚本读取 DB（database）中的数据导出成 excel 文件。

```go
func main() {
    // Create a new sheet.
	f := excelize.NewFile()
	// MOCK的数据
	list := []PendingData{
		{Brand: "abc.com", TLD: "100/100", Include: "100/100", Typo: "100/100", Added: "2024-02-17"},
		{Brand: "abcasdf.com", TLD: "100/100", Include: "100/100", Typo: "100/100", Added: "2024-02-17"},
	}
	excelList := make([][]interface{}, 0)
	// 设置表头
	excelList = append(excelList, []interface{}{"Brand", "TLD", "Include", "Typo", "Added"})
	for _, data := range list {
		excelList = append(excelList, []interface{}{data.Brand, data.TLD, data.Include, data.Typo, data.Added})
	}
	for idx, row := range excelList {
		cell, err := excelize.CoordinatesToCellName(1, idx+1)
		if err != nil {
			fmt.Println(err)
			return
		}
		f.SetSheetRow("Sheet1", cell, &row)
	}
	if err := f.SaveAs("test.xlsx"); err != nil {
		return
	}
}
```

### 2. 文件流导出

> 应用场景：常用于 HTTP API 接口读取 DB（database）中的数据导出成 excel 文件。

```go
func main() {
	http.HandleFunc("/download", func(w http.ResponseWriter, r *http.Request) {
		// 创建一个新的Excel文件
		f := excelize.NewFile()
		// 创建一个新的表
		sheet := f.NewSheet("Sheet1")
		// 设置活动的Sheet
		f.SetActiveSheet(sheet)
		// 设置单元格的值
		f.SetCellValue("Sheet1", "A1", "Hello")
		f.SetCellValue("Sheet1", "B1", "World")

		// 设置响应的header信息，这样浏览器会将响应作为一个文件下载
		w.Header().Add("Content-Type", "application/octet-stream")
		w.Header().Add("Content-Disposition", "attachment; filename=HelloWorld.xlsx")
		// 将文件写入响应
		if err := f.Write(w); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	})

	http.ListenAndServe(":8000", nil)
}
```

### 3. 文件转 Base64 导出

> 应用场景：常用于 HTTP API 接口读取 DB（database）中的数据导出成 excel 文件。

```go
func main() {
	// 创建一个新的Excel文件
	f := excelize.NewFile()
	// 创建一个新的表
	sheet := f.NewSheet("Sheet1")
	// 设置活动的Sheet
	f.SetActiveSheet(sheet)
	// 设置单元格的值
	f.SetCellValue("Sheet1", "A1", "Hello")
	f.SetCellValue("Sheet1", "B1", "World")

	// 创建一个bytes.Buffer，并将Excel文件写入其中
	buf := new(bytes.Buffer)
	if err := f.Write(buf); err != nil {
		fmt.Println("Error writing file to buffer:", err)
		return
	}

	// 将Excel文件转换为Base64编码
	base64Str := base64.StdEncoding.EncodeToString(buf.Bytes())
	fmt.Println(base64Str)
}
```

## 导入

### 1. 直接读取本地文件

> 应用场景：常用于脚本读取本地文件导入数据到 DB（database） 中。

```go
func main() {
    f, err := excelize.OpenFile("test.xlsx")
	if err != nil {
		panic(err)
	}
	rows, err := f.GetRows("Sheet1")
	if err != nil {
		fmt.Println(err)
		return
	}
	for _, row := range rows {
		for _, colCell := range row {
			fmt.Print(colCell, "\t")
		}
		fmt.Println()
	}
}
```

### 2. 从 io 数据流中读取

> 应用场景：从 HTTP form-data 请求中读取 excel 文件。

```go
package main

import (
    "fmt"
    "net/http"

    "github.com/xuri/excelize/v2"
)

func process(w http.ResponseWriter, req *http.Request) {
    file, _, err := req.FormFile("file")
    if err != nil {
        fmt.Fprintf(w, err.Error())
        return
    }
    defer file.Close()
    f, err := excelize.OpenReader(file)
    if err != nil {
        fmt.Fprintf(w, err.Error())
        return
    }
    f.NewSheet("NewSheet")
    w.Header().Set("Content-Disposition", "attachment; filename=Book1.xlsx")
    w.Header().Set("Content-Type", req.Header.Get("Content-Type"))
    if _, err := f.WriteTo(w); err != nil {
        fmt.Fprintf(w, err.Error())
    }
    return
}

func main() {
    http.HandleFunc("/process", process)
    http.ListenAndServe(":8090", nil)
}
```

<center>
	<p>欢迎关注我的公众号: <span style="font-weight: 600;color: blue;">小付同学的开发日常</span>，原创技术文章第一时间推送。</p>
    <img src="https://pic.ziyuan.wang/user/guest/2024/01/傅1_1932a233b5837.jpeg" style="width: 300px;">
</center>

# 参考

[^1]: excelize: https://github.com/qax-os/excelize
[^2]: easyexcel: https://github.com/alibaba/easyexcel
