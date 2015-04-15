(function() {
    var danmaku = {};

    var DanmakuPlayer = function(element) {

        var danmakuPool = [];

        var interval = null;

        var tick = 0;

        var tickDelay = 33.33;

        var container = element;

        var Danmaku = function(element, tick) {
            this.element = element;
            this.tick = tick;
            element.style.position = 'absolute';
            //element.style.display = 'none';
            container.appendChild(element);
        }

        this.play = function() {
            var render = function () {
                for(var i in danmakuPool) {
                    var danmaku = danmakuPool[i];
                    var left = container.offsetLeft + container.offsetWidth - (tick - danmaku.tick);
                    
                    var top = container.offsetTop;
                    for(var j in danmakuPool) {
                        if(danmaku === danmakuPool[j])
                            break;
                        var tickRight = danmakuPool[j].tick + danmakuPool[j].element.offsetWidth;
                        if(danmaku.tick < tickRight) {
                            if(top + danmaku.element.offsetHeight > danmakuPool[j].element.offsetTop) {
                                top = danmakuPool[j].element.offsetTop + danmakuPool[j].element.offsetHeight;
                            }
                        }
                    }                    
                    
                    danmaku.element.style.left = left + 'px';
                    danmaku.element.style.top = top + 'px';
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

        this.setTick = function(tickTo) {
            tick = tickTo;
        }
        
        this.getTick = function () {
            return tick;
        }
        
        this.setTickRate = function(tps) {
            tickDelay = 1000 / tps;
        }

        var putElement = function(danmakuElement, tick) {
            var insertPos = danmakuPool.length;
            for(var i in danmakuPool) {
                if(danmakuPool[i].tick > tick) {
                    insertPos = i;
                    break;
                }
            }
            danmakuPool.splice(insertPos, 0, new Danmaku(danmakuElement, tick));
        }

        var putText = function(danmakuText, tick) {
            var element = document.createElement('span');
            element.textContent = danmakuText;
            element.style.whiteSpace = 'nowrap';
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
