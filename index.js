/**
 * Created by gaofeng on 2018/10/4.
 */
window.onload = function(){
    var oBtn = getId('gameBtn')
    var oDiv1 = getId('div1')
    var oWarning = getId('warning')

    oDiv1.style.width = view().w + 'px';

    oBtn.onclick = function(){
        this.style.display = 'none';
        oWarning.style.display = 'none';
        Game.init('div1')
    }
}

function getId(id){
    return document.getElementById(id)
}
function view (){
    return {
        w : document.documentElement.clientWidth,
        h : document.documentElement.clientHeight
    }
}

var Game = {
    oEnemy : {
        el1 : {style : 'enemy1' ,blood : 1,speed :1,score :1},
        el2 : {style : 'enemy2' ,blood : 2,speed :2,score :2},
        el3 : {style : 'enemy3' ,blood : 3,speed :10,score :3},
    },
    gk : [
        {
            eMap : [
                "el2","el2","el2","el2","el2","el2","el2","el2","el2","el2",
                "el2","el2","el2","el2","el2","el2","el2","el2","el2","el2",
                "el2","el2","el2","el2","el2","el2","el2","el2","el2","el2",
                "el1","el1","el1","el1","el1","el1","el1","el1","el1","el1",
                "el1","el1","el1","el1","el1","el1","el1","el1","el1","el1",
                "el1","el1","el1","el1","el1","el1","el1","el1","el1","el1"
            ],
            colNum : 10,
            iSpeedX : 10,
            iSpeedY : 10,
            times : 2000
        },
        {
            eMap : [
                "el3","el3","el3","el3","el3","el3","el3","el3","el3","el3",
                "el3","el3","el3","el3","el3","el3","el3","el3","el3","el3",
                "el3","el3","el3","el3","el3","el3","el3","el3","el3","el3",
                "el1","el1","el1","el1","el1","el1","el1","el1","el1","el1",
                "el1","el1","el1","el1","el1","el1","el1","el1","el1","el1",
                "el1","el1","el1","el1","el1","el1","el1","el1","el1","el1"

            ],
            colNum : 10,
            iSpeedX : 10,
            iSpeedY : 10,
            times : 2000
        }
    ],
    air : { //飞机的数据
        style : 'air1',
        bulletStyle : 'bullet'
    },
    init : function(id){
        this.oParent = getId(id);
        this.createScore();
        this.createEnemy(0);
        this.createAir()
    },
    createScore:function(){
        var oS = document.createElement('div');
        oS.id = 'score';
        oS.innerHTML = "积分是:<span>0</span>分";
        this.oParent.appendChild(oS)
        this.oSNum = oS.getElementsByTagName("span")[0];
    },
    createEnemy:function(iNow){ //敌人的创建
        if(this.oUl){
            clearInterval(this.oUl.timer)
            this.oParent.removeChild(this.oUl)
        }
        var gk = this.gk[iNow];
        var oUl = document.createElement('ul');
        this.oUl = oUl;
        oUl.id = 'bee';
        oUl.style.width = gk.colNum * 40 + 'px' ;
        this.oParent.appendChild(oUl);
        var arr = [];
        oUl.style.left = (this.oParent.offsetWidth - oUl.offsetWidth)/2 + 'px';
        for(var i=0;i<gk.eMap.length;i++){
            var oLi = document.createElement('li');
                oLi.className = this.oEnemy[gk.eMap[i]].style;
                oLi.blood = this.oEnemy[gk.eMap[i]].blood;
                oLi.speed = this.oEnemy[gk.eMap[i]].speed;
                oLi.score = this.oEnemy[gk.eMap[i]].score;
                oUl.appendChild(oLi)
        }
        this.aLi = oUl.getElementsByTagName('li');
        for(var i=0;i<this.aLi.length;i++){
            arr.push([this.aLi[i].offsetLeft,this.aLi[i].offsetTop])
        }
        for(var i=0;i<this.aLi.length;i++){
            this.aLi[i].style.position = 'absolute';
            this.aLi[i].style.left = arr[i][0] + 'px';
            this.aLi[i].style.top = arr[i][1] + 'px';
        }
        this.runEenemy(gk);
    },
    runEenemy:function(gk){ //整体的移动
        var That = this;
        var L = 0;
        var R = this.oParent.offsetWidth - this.oUl.offsetWidth ;
        this.oUl.timer = setInterval(function(){
            if(That.oUl.offsetLeft >= R) {
                gk.iSpeedX *= -1;
                That.oUl.style.top = That.oUl.offsetTop + gk.iSpeedY + 'px';
            }else if(That.oUl.offsetLeft <= L){
                gk.iSpeedX *= -1;
                That.oUl.style.top = That.oUl.offsetTop + gk.iSpeedY + 'px';
            }
            That.oUl.style.left = That.oUl.offsetLeft + gk.iSpeedX + "px";
        },200)

        setInterval(function(){
            That.oneMove()
        },gk.times)
    },
    oneMove :function(){
        var That = this;
        var nowLi = That.aLi[Math.floor(Math.random()*this.aLi.length)];
        nowLi.timer = setInterval(function(){
            var a = (That.oA.offsetLeft + That.oA.offsetWidth/2) - ( nowLi.offsetLeft + nowLi.parentNode.offsetLeft +
                That.oA.offsetWidth/2);
            var b = (That.oA.offsetTop + That.oA.offsetHeight/2) - ( nowLi.offsetTop + nowLi.parentNode.offsetTop +
                That.oA.offsetHeight/2);
            var c = Math.sqrt(a*a + b*b);
            var isX = nowLi.speed * a/c;
            var isY = nowLi.speed * b/c;

            nowLi.style.left = nowLi.offsetLeft + isX + 'px';
            nowLi.style.top = nowLi.offsetTop + isY + 'px';
            if(That.pz(That.oA,nowLi)){
                alert("游戏结束");
                window.location.reload();
            }

        },30)
    },

    createAir : function(){ //创建飞机
        var oA = document.createElement('div');
            oA.className = this.air.style;
            this.oA = oA ;
            this.oParent.appendChild(oA);
            oA.style.top = this.oParent.offsetHeight - oA.offsetHeight + "px"
            oA.style.left = (this.oParent.offsetWidth - oA.offsetWidth)/2 + "px"
            this.bindAir();
    },
    bindAir : function(){

            var timer = null;
            var That = this;
            var iNum;
            var That = this;
            document.onkeydown = function(ev){
                var ev = ev || window.event;
                if(!timer){
                    timer = setInterval(show,30)
                }
                if(ev.keyCode == 37){
                    iNum = 1;
                }else if(ev.keyCode == 39){
                    iNum = 2;
                }
            }
            document.onkeyup = function(ev){
                var ev = ev || window.event;
                clearInterval(timer);
                timer = null;
                iNum = 0;
                if(ev.keyCode == 32){
                    That.createBullet();
                }
            }
            function show(){
                if( iNum == 1 ){
                    That.oA.style.left = That.oA.offsetLeft - 10 + 'px'
                }else if( iNum ==2 ){
                    That.oA.style.left = That.oA.offsetLeft + 10 + 'px'
                }
            }
    },
    createBullet : function(){ //子弹的创建
        var oB = document.createElement('div');
        oB.className = this.air.bulletStyle;
        this.oParent.appendChild(oB)
        oB.style.left = this.oA.offsetLeft + this.oA.offsetWidth/2 + 'px';
        oB.style.top = this.oA.offsetTop - 10 + 'px';
        this.runBullet(oB)
    },
    runBullet : function(oB){ //子弹的运动;
        var That = this;
        oB.Timer = setInterval(function(){
            if(oB.offsetTop < -10){
                clearInterval(oB.Timer);
                That.oParent.removeChild(oB)
            }else{
                oB.style.top = oB.offsetTop - 10 + 'px'
            }
            for(var i=0;i<That.aLi.length;i++){
                if(That.pz(oB,That.aLi[i])){
                    if(That.aLi[i].blood == 1) {
                        clearInterval(That.aLi[i].timer)
                        That.oSNum.innerHTML = parseInt(That.oSNum.innerHTML) + That.aLi[i].score;
                        That.oUl.removeChild(That.aLi[i])

                    }else{
                        That.aLi[i].blood--;
                    }

                    clearInterval(oB.Timer)
                    That.oParent.removeChild(oB)
                }
            }
            if(!That.aLi.length){
                That.createEnemy(1)
            }
        },30)
    },
    pz : function(obj1,obj2){
        var L1 = obj1.offsetLeft;
        var R1 = obj1.offsetLeft + obj1.offsetWidth;
        var T1 = obj1.offsetTop;
        var B1 = obj1.offsetTop + obj1.offsetHeight;

        var L2 = obj2.offsetLeft + obj2.parentNode.offsetLeft;
        var R2 = obj2.offsetLeft + obj2.offsetWidth+obj2.parentNode.offsetLeft;
        var T2 = obj2.offsetTop + obj2.parentNode.offsetTop;
        var B2 = obj2.offsetTop + obj2.offsetHeight + obj2.parentNode.offsetTop;


        if( R1 < L2 || L1 > R2 ||  B1 < T2 || T1 > B2 ){
            return false;
        }else{
            return true;
        }
    }
}