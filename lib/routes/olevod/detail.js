const got = require('@/utils/got');
const cheerio = require('cheerio');
const { Console } = require('console');
// const url = require('url');

// 域名,直接跳转到网页
const host = 'https://www.olevod.com/index.php/vod/detail/id/';
const urllink = 'https://www.olevod.com';

// 进行数据传递
module.exports = async (ctx) => {
    // 这里获取到传入的参数，也就是 传入id的具体
    // 通过 || 来实现设置一个默认值
    const id = ctx.params.id || '33331';
    const para = id + '.html';
    const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:65.0) Gecko/20100101 Firefox/65.0';

    const link = host + para;

    // 请求发送
    const response = await got({
        method: 'get', // 请求的方法是 get，这里一般都是 get
        url: urllink, // 请求的链接，也就是文章列表页
        headers: {
            'User-Agent': USER_AGENT,

            'X-Requested-With': 'XMLHttpRequest',
        },
    });
    Console.alert(link);
    // 用 cheerio 来把请求回来的数据转成 DOM，方便操作
    const $ = cheerio.load(response.data);

    // 标题提取
    const title1 = $('.title').text();

    // 图片
    const poster = $('.vodlist_thumb').attr('data-original');
    // 列表提取
    const lists = $('.content_playlist')
        .find('a')
        .map((i, item) => ({
            title: $(item).text(),
            description: urllink + poster,
            link: urllink + $(item).attr('href'),
        }))
        .get();

    ctx.state.data = {
        title: title1,
        link: `https://www.olevod.com/index.php/vod/detail/id/${ctx.params.id}`,

        item: lists,
    };
};
