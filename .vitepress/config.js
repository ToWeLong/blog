import { defineConfig } from 'vitepress'
import footnote_plugin from 'markdown-it-footnote'
import { getPosts } from './theme/serverUtils'

//每页的文章数量
const pageSize = 10
const description =
    '小付同学的开发日常，towelong的博客。致力于分享编程知识和技术实践，无论你是编程新手还是资深开发者，都能在这里找到启发和收获。在这个blog中，你可以深入了解golang和Python的学习资源，以及小付同学在开发过程中的心得体验和实用技巧。'

export default defineConfig({
    title: '小付同学的开发日常',
    titleTemplate: ':title - 小付同学的开发日常',
    base: '/',
    cacheDir: './node_modules/vitepress_cache',
    description: description,
    metaChunks: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    ignoreDeadLinks: true,
    head: [
        [
            'script',
            {
                async: '',
                src: 'https://uwei.zeabur.app/script.js',
                'data-website-id': 'b19e7f1a-f9af-473a-ad36-7153787a1244'
            }
        ]
    ],
    themeConfig: {
        posts: await getPosts(pageSize),
        website: 'https://blog.xiaozi.cc', //copyright link
        // 评论的仓库地址
        comment: {
            repo: 'towelong/blog',
            themes: 'github-light',
            issueTerm: 'pathname'
        },
        siteTitle: '小付同学的开发日常',
        nav: [
            { text: '首页', link: '/' },
            { text: '归档', link: '/pages/archives' },
            { text: '标签', link: '/pages/tags' },
            { text: '关于', link: '/pages/about' }
            // { text: 'Airene', link: 'http://airene.net' }  -- External link test
        ],
        search: {
            provider: 'local'
        },
        //outline:[2,3],
        outlineTitle: '目录',
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
    },
    transformHead: ({ pageData }) => {
        const head = []

        head.push(['meta', { property: 'og:title', content: pageData.frontmatter.title + ' - 小付同学的开发日常' }])
        if (pageData.frontmatter.description) {
            head.push(['meta', { property: 'og:description', content: pageData.frontmatter.description }])
        } else {
            head.push(['meta', { property: 'og:description', content: description }])
        }
        return head
    }
})
