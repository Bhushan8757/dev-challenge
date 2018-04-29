import * as fxObject from './mockData';

// const Stomp = require('stompjs')
// const util = require('util')
//let client = Stomp.Stomp.over('ws://localhost:8011')

class FxPrice {
  constructor(startPrices) {
    this.startPrices = fxObject.startPrices;
    this.fxJsonData = [];
  }
  _createData(){
    _.forEach(this.startPrices, (key, value) => {
      const spread = _.random(0, 0.5);
      this.fxJsonData.push({
        name: value,
        bestBid: key - key * (spread / 2),
        bestAsk: key + key * (spread / 2),
        openBid: key - key * (spread / 2),
        openAsk: key + key * (spread / 2),
        lastChangeAsk: 0,
        lastChangeBid: 0
      })
    });
      return this.fxJsonData;
   }
        
    showData(){
      let  displayObject = _.random(1, 5);
      let fxOldData = this._createData();
      fxOldData.length = displayObject;
      _.forEach(fxOldData, (value) => {
        const oldPrice = this.startPrices[value.name]
        const diff = (Math.random() * 0.08 - 0.04) * oldPrice
        const newPrice = (oldPrice + diff)
        const spread = _.random(0, 0.5);
        const bid = newPrice - newPrice * (spread / 2)
        const ask = newPrice + newPrice * (spread / 2)
        const data = value
        data.lastChangeBid = bid - data.bestBid
        data.lastChangeAsk = ask - data.bestAsk
        data.bestBid = bid
        data.bestAsk = ask
        return this._createTable(data)
      });
    }

    _createTable(data){
      let row = document.createElement("tr");
      row.innerHTML = `<td>${data.name}</td><td>${data.bestBid}</td><td>${data.bestAsk}</td><td>${data.openBid}</td>
                        <td>${data.openAsk}</td><td>${data.lastChangeAsk}</td><td>${data.lastChangeBid}</td><td>
                        <span class='sparkline'></span><td>`
      document.getElementById("fxRate").appendChild(row);
      let sparkline = new Sparkline(row.querySelector("span.sparkline"), {startColor:"red", minColor:"blue", maxColor:"green", width:150, lineColor:"#666"});
            
      sparkline.draw([data.bestBid, data.bestAsk + data.bestAsk/2, data.bestAsk, data.openBid, data.openBid + data.openAsk/2, data.openAsk])
    }

}
let newFx = new FxPrice();
let ws = new WebSocket("ws://localhost:8011/fx/price");

setInterval(ws.onopen = function() {
  document.getElementById("fxRate").innerHTML = '';
  ws.send(newFx.showData());
}, 30000);


