export const THEME_CONFIG: App.Locals['config'] = {
    /** blog title */
    title: '小付同学的开发日常',
    /** your name */
    author: 'Towelong',
    /** website description */
    desc: '致力于分享编程知识和技术实践，无论你是编程新手还是资深开发者，都能在这里找到启发和收获。在这个博客中，你可以深入了解编程开发，以及小付同学在开发过程中的心得体验和实用技巧。',
    /** your deployed domain */
    website: 'https://blog.xiaozi.cc/',
    /** your locale */
    locale: 'zh-cn',
    /** theme style */
    themeStyle: 'auto',
    /** your socials */
    socials: [
        {
            name: 'github',
            href: 'https://github.com/towelong'
        },
        {
            name: 'rss',
            href: '/atom.xml'
        },
        {
            name: 'twitter',
            href: 'https://twitter.com/towelong'
        }
        // {
        //   name: "mastodon",
        //   href: "https://github.com/moeyua/astro-theme-typography",
        // }
    ],
    /** your header info */
    header: {
        twitter: '@towelong'
    },
    /** your navigation links */
    navs: [
        {
            name: 'Posts',
            href: '/posts/page/1'
        },
        {
            name: 'Archive',
            href: '/archive'
        },
        {
            name: 'Categories',
            href: '/categories'
        },
        {
            name: 'About',
            href: '/about'
        }
    ],
    /** your category name mapping, which the `path` will be shown in the url */
    category_map: []
}
