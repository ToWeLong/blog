import { defineConfig } from 'vitepress'
import footnote_plugin from "markdown-it-footnote";
import { getPosts } from './theme/serverUtils'

//每页的文章数量
const pageSize = 10

export default defineConfig({
    title: 'welong',
    base: '/blog/',
    cacheDir: './node_modules/vitepress_cache',
    description: 'towelong,博客,blog,golang学习,Python学习',
    ignoreDeadLinks: true,
    themeConfig: {
        posts: await getPosts(pageSize),
        website: 'https://towelong.github.io/blog', //copyright link
        // 评论的仓库地址
        comment: {
            repo: 'towelong/blog',
            themes: 'github-light',
            issueTerm: 'pathname'
        },
        nav: [
            { text: '首页', link: '/' },
            { text: '归档', link: '/pages/archives' },
            { text: '标签', link: '/pages/tags' },
            { text: '关于', link: '/pages/about' }
            // { text: 'Airene', link: 'http://airene.net' }  -- External link test
        ],
        search: {
            provider: 'local',
        },
        //outline:[2,3],
        outlineTitle: '文章摘要',
        socialLinks: [{ icon: 'github', link: 'https://github.com/towelong' }]
    },
    srcExclude: ['README.md'], // exclude the README.md , needn't to compiler

    vite: {
        //build: { minify: false }
        server: { port: 5000 }
    },
    markdown: {
        config: (md) => {
            md.use(footnote_plugin)
        }
    }
})

