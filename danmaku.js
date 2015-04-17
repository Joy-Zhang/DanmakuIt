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

        var Rect = function(danmaku, container, tick) {
            this.left = container.offsetLeft + container.offsetWidth - (tick - danmaku.tick);
            this.top = danmaku.element.offsetTop;
            this.right = this.left + danmaku.element.offsetWidth;
            this.bottom = danmaku.element.offsetTop + danmaku.element.offsetHeight;
        }

        var conflict = function(rect, rectToCompare) {
            return rect.left < rectToCompare.right &&
                    rect.top < rectToCompare.bottom &&
                    rect.bottom > rectToCompare.top;
        }

        this.play = function() {
            var render = function () {
                for(var i in danmakuPool) {
                    var danmaku = danmakuPool[i];
                    
                    var danmakuRect = new Rect(danmaku, container, tick);
                    for(var j = 0; j < danmakuPool.length; j++) {
                        if(danmaku === danmakuPool[j])
                            break;
                        var rectToCompare = new Rect(danmakuPool[j], container, tick);
                        if(conflict(danmakuRect, rectToCompare)) {
                            danmakuRect.top = rectToCompare.bottom;
                            j = -1;
                        }
                    }
                    
                    danmaku.element.style.left = danmakuRect.left + 'px';
                    danmaku.element.style.top = danmakuRect.top + 'px';
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
