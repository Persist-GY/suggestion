class Suggestion {

    constructor(options) {
        if (!options.input || !options.ul) {
            throw new Error('错误')
        }
        this.$input = options.input
        this.$ul = options.ul;
        this.show = options.show;
        this.index = -1;
        this.timer;
        this.bindEvents();
    }
    //绑定事件
    bindEvents() {
        this.$input.on('input', () => {
            if (this.$input.val() === '') {
                this.$ul.empty();
                return;
            }
            this.searchKeywords().then( ret => {
                //收到结果,操作dom
                var $dataArr = $(ret.data.items)
                var $li = ''
                $dataArr.each((index, obj) => {
                    // console.log(index,obj)
                    $li += '<li><a target="_blank" href=' + obj.html_url + '>' + obj.full_name + '</a></li>'
                })
                this.$ul.html($li)
                var $lii = this.$ul.children().eq(0)
                $lii.addClass(this.show)
            },
                error => {
                    console.log(123)
                }
            )
        })


        this.$input.on('keydown', e => {
            // console.log(e)
            //往下
            if (e && e.keyCode == 40) {
                this.index++;
                var $li = this.$ul.children()
                if (this.index >= $li.length) {
                    this.index = 0;
                } else {

                }
                $li.removeClass(this.show)
                $li.eq(this.index).addClass(this.show)

            }
            //往上
            if (e && e.keyCode == 38) {
                var $li = this.$ul.children()
                $li.removeClass(this.show)
                this.index--;
                if (this.index >= 0) {

                } else {
                    this.index = $li.length - 1;
                }
                $li.eq(this.index).addClass(this.show)
            }

        })
        //回车
        this.$input.on('keyup', e => {
            if (e && e.keyCode == 13) {

                if (this.index < 0) {
                    return;
                }
                var $li = this.$ul.children().eq(this.index)
                var $a = $($li.children()[0])
                window.open($a.attr("href"))

            }
        })

        //鼠标进入区域,删除其他效果
        this.$ul.on('mouseenter', 'li', () => {
            
            var $li = this.$ul.children()
            $li.removeClass(this.show)
            this.index = -1;
        })
    }

    //请求数据
    searchKeywords() {

        var promise = new Promise((success, error) => {
            if (this.timer) {
                clearTimeout(this.timer)
            }
            this.timer = setTimeout(() => {
                $.ajax({
                    url: "https://api.github.com/search/repositories",
                    dataType: 'jsonp',
                    data: { q: this.$input.val() },
                    jsonp: 'callback',
                    success: result => success(result),
                    error: error => error()

                });
            }, 500)

        })
        return promise;
    }
}