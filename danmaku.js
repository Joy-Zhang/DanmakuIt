(function() {
    var danmaku = {};

    var DanmakuPlayer = function(element) {

        var danmakuPool = [];

        var interval = null;

        var tick = 0;

        var tickDelay = 33.333333;

        var container = element;

        var Danmaku = function(element, tick) {
            this.element = element;
            this.tick = tick;
            element.style.position = 'absolute';
            container.appendChild(element);
        }

        this.play = function() {
            var render = function () {
                for(var i in danmakuPool) {
                    var danmaku = danmakuPool[i];
                    var left = container.offsetLeft + container.offsetWidth - (tick - danmaku.tick);
                    danmaku.element.style.left = left + 'px';
                }
                tick++;
            }
            interval = setInterval(render, tickDelay);
        }

        this.pause = function() {
            clearInterval(interval);
        }

        this.stop = function() {
            clearInterval(interval);
            tick = 0;
        }

        this.goToTick = function(tickTo) {
            tick = tickTo;
        }

        this.setTickRate = function(tps) {
            tickDelay = 1000 / tps;
        }

        var putElement = function(danmakuElement, tick) {
            danmakuPool.push(new Danmaku(danmakuElement, tick));
        }

        var putText = function(danmakuText, tick) {
            var element = document.createElement('span');
            element.textContent = danmakuText;
            putElement(element, tick);
        }

        this.put = function(danmaku, tick) {
            if(typeof(danmaku) === 'string')
                putText(danmaku, tick);
            else
                putElement(danmaku, tick);
        }


    }

    danmaku.attach = function(element) {
        var container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = element.offsetTop + 'px';
        container.style.left = element.offsetLeft + 'px';
        container.style.width = element.offsetWidth + 'px';
        container.style.height = element.offsetHeight + 'px';
        container.style.color = 'white';
        container.id = 'danmaku';
        element.parentNode.appendChild(container);
        return new DanmakuPlayer(container);
    }

    this.danmaku = danmaku;

}).call(this);
