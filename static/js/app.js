// File Name: static/app.js
// Author: JackeyGao
// mail: gaojunqi@outlook.com
// Created Time: 五  8/19 22:59:57 2016

Vue.config.delimiters = ['${', '}}']

var STORAGE_KEY = 'tasks';
var colors = [ 
  "green", "red", "yellow", "teal", 
  "orange", "black", "olive", "blue", 
  "violet", "purple", "pink", "brown", ""
  ]

var ref = new Wilddog("https://tanxiao.wilddogio.com/labels");

function getRandomInt(range, wt) {
    var range = range || 75
    var wt = wt || 2
    return Math.floor(Math.random() * range + wt)
}

function genRandomLabelHandler(value, is_avatar) {
  if (!value) {
      return;
  }

  is_avatar = typeof is_avatar !== 'undefined' ?  is_avatar : true;
  if (is_avatar) {
    var avatar = $('#avatar').attr('src');
  } else {
    var avatar = is_avatar;
  }
  
  var div = document.getElementById('tanxiao');
  var x = getRandomInt();
  var y = getRandomInt();
  var basic = Math.random() < 0.5 ? true : false;
  var zy = Math.random() < 0.5 ? 'left' : 'right';
  var color = colors[Math.floor(Math.random() * colors.length)]

  if (value.length === 1) {
      var size = '3.8em';
  } else {
      var size = .7 + (4 / value.length) + 'em'
  }
  
  var styles = 'position: absolute;' + zy + ': ' + x + '%; top: ' + y + '%; font-size: ' + size + ';';
  return { content: value, color: color, basic: basic, avatar: avatar, styles: styles };
}


Vue.transition('fade', {
  css: false,
  enter: function (el, done) {
    $(el)
      .css('opacity', 0)
      .animate({ opacity: 1 }, 1000, done)
  },
  enterCancelled: function (el) {
    $(el).stop()
  },
  leave: function (el, done) {
    // 与 enter 相同
    $(el).animate({ opacity: 0 }, 4000, done)
  },
  leaveCancelled: function (el) {
    $(el).stop()
  }
})

window.labels = []

$.each(['身', '经', '百', '战', '方', '可', '谈', '笑', '风', '生'], function(index, value) {
  window.labels.push(genRandomLabelHandler(value, false));
});



var vm = new Vue({
  el: "#tanxiao",
  data: {
      newTitle: "",
      labels: window.labels,
  },
  methods: {
      addLabel: function() {
          var value = this.newTitle && this.newTitle.trim();
          this.newTitle = "";
          label = genRandomLabelHandler(value);
          ref.push(label);
          if (this.labels.length > 20) {
            // 如果队列大于三十则去除最早的记
            this.labels.shift();
          }
      }
  },
})


ref.limitToLast(20).on("child_added", function(snapshot) {
  this.labels.push(snapshot.val());
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

