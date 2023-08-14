"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[8633],{8633:(z,b,l)=>{l.r(b),l.d(b,{ion_item_option:()=>d,ion_item_options:()=>h,ion_item_sliding:()=>E});var p=l(5861),n=l(6953),w=l(4237),f=l(7876),u=l(544),g=l(4435),k=l(8639);const d=class{constructor(t){(0,n.r)(this,t),this.onClick=i=>{i.target.closest("ion-item-option")&&i.preventDefault()},this.color=void 0,this.disabled=!1,this.download=void 0,this.expandable=!1,this.href=void 0,this.rel=void 0,this.target=void 0,this.type="button"}render(){const{disabled:t,expandable:i,href:e}=this,o=void 0===e?"button":"a",a=(0,f.b)(this),c="button"===o?{type:this.type}:{download:this.download,href:this.href,target:this.target};return(0,n.h)(n.H,{onClick:this.onClick,class:(0,w.c)(this.color,{[a]:!0,"item-option-disabled":t,"item-option-expandable":i,"ion-activatable":!0})},(0,n.h)(o,Object.assign({},c,{class:"button-native",part:"native",disabled:t}),(0,n.h)("span",{class:"button-inner"},(0,n.h)("slot",{name:"top"}),(0,n.h)("div",{class:"horizontal-wrapper"},(0,n.h)("slot",{name:"start"}),(0,n.h)("slot",{name:"icon-only"}),(0,n.h)("slot",null),(0,n.h)("slot",{name:"end"})),(0,n.h)("slot",{name:"bottom"})),"md"===a&&(0,n.h)("ion-ripple-effect",null)))}get el(){return(0,n.f)(this)}};d.style={ios:":host{--background:var(--ion-color-primary, #3880ff);--color:var(--ion-color-primary-contrast, #fff);background:var(--background);color:var(--color);font-family:var(--ion-font-family, inherit)}:host(.in-list.item-options-end:last-child){-webkit-padding-end:calc(0.7em + var(--ion-safe-area-right));padding-inline-end:calc(0.7em + var(--ion-safe-area-right))}:host(.in-list.item-options-start:first-child){-webkit-padding-start:calc(0.7em + var(--ion-safe-area-left));padding-inline-start:calc(0.7em + var(--ion-safe-area-left))}:host(.ion-color){background:var(--ion-color-base);color:var(--ion-color-contrast)}.button-native{font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;-webkit-padding-start:0.7em;padding-inline-start:0.7em;-webkit-padding-end:0.7em;padding-inline-end:0.7em;padding-top:0;padding-bottom:0;display:inline-block;position:relative;width:100%;height:100%;border:0;outline:none;background:transparent;cursor:pointer;-webkit-appearance:none;-moz-appearance:none;appearance:none;-webkit-box-sizing:border-box;box-sizing:border-box}.button-inner{display:-ms-flexbox;display:flex;-ms-flex-flow:column nowrap;flex-flow:column nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%}.horizontal-wrapper{display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%}::slotted(*){-ms-flex-negative:0;flex-shrink:0}::slotted([slot=start]){-webkit-margin-start:0;margin-inline-start:0;-webkit-margin-end:5px;margin-inline-end:5px;margin-top:0;margin-bottom:0}::slotted([slot=end]){-webkit-margin-start:5px;margin-inline-start:5px;-webkit-margin-end:0;margin-inline-end:0;margin-top:0;margin-bottom:0}::slotted([slot=icon-only]){padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;-webkit-margin-start:10px;margin-inline-start:10px;-webkit-margin-end:10px;margin-inline-end:10px;margin-top:0;margin-bottom:0;min-width:0.9em;font-size:1.8em}:host(.item-option-expandable){-ms-flex-negative:0;flex-shrink:0;-webkit-transition-duration:0;transition-duration:0;-webkit-transition-property:none;transition-property:none;-webkit-transition-timing-function:cubic-bezier(0.65, 0.05, 0.36, 1);transition-timing-function:cubic-bezier(0.65, 0.05, 0.36, 1)}:host(.item-option-disabled){pointer-events:none}:host(.item-option-disabled) .button-native{cursor:default;opacity:0.5;pointer-events:none}:host{font-size:16px}:host(.ion-activated){background:var(--ion-color-primary-shade, #3171e0)}:host(.ion-color.ion-activated){background:var(--ion-color-shade)}",md:":host{--background:var(--ion-color-primary, #3880ff);--color:var(--ion-color-primary-contrast, #fff);background:var(--background);color:var(--color);font-family:var(--ion-font-family, inherit)}:host(.in-list.item-options-end:last-child){-webkit-padding-end:calc(0.7em + var(--ion-safe-area-right));padding-inline-end:calc(0.7em + var(--ion-safe-area-right))}:host(.in-list.item-options-start:first-child){-webkit-padding-start:calc(0.7em + var(--ion-safe-area-left));padding-inline-start:calc(0.7em + var(--ion-safe-area-left))}:host(.ion-color){background:var(--ion-color-base);color:var(--ion-color-contrast)}.button-native{font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;-webkit-padding-start:0.7em;padding-inline-start:0.7em;-webkit-padding-end:0.7em;padding-inline-end:0.7em;padding-top:0;padding-bottom:0;display:inline-block;position:relative;width:100%;height:100%;border:0;outline:none;background:transparent;cursor:pointer;-webkit-appearance:none;-moz-appearance:none;appearance:none;-webkit-box-sizing:border-box;box-sizing:border-box}.button-inner{display:-ms-flexbox;display:flex;-ms-flex-flow:column nowrap;flex-flow:column nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%}.horizontal-wrapper{display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%}::slotted(*){-ms-flex-negative:0;flex-shrink:0}::slotted([slot=start]){-webkit-margin-start:0;margin-inline-start:0;-webkit-margin-end:5px;margin-inline-end:5px;margin-top:0;margin-bottom:0}::slotted([slot=end]){-webkit-margin-start:5px;margin-inline-start:5px;-webkit-margin-end:0;margin-inline-end:0;margin-top:0;margin-bottom:0}::slotted([slot=icon-only]){padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;-webkit-margin-start:10px;margin-inline-start:10px;-webkit-margin-end:10px;margin-inline-end:10px;margin-top:0;margin-bottom:0;min-width:0.9em;font-size:1.8em}:host(.item-option-expandable){-ms-flex-negative:0;flex-shrink:0;-webkit-transition-duration:0;transition-duration:0;-webkit-transition-property:none;transition-property:none;-webkit-transition-timing-function:cubic-bezier(0.65, 0.05, 0.36, 1);transition-timing-function:cubic-bezier(0.65, 0.05, 0.36, 1)}:host(.item-option-disabled){pointer-events:none}:host(.item-option-disabled) .button-native{cursor:default;opacity:0.5;pointer-events:none}:host{font-size:14px;font-weight:500;text-transform:uppercase}"};const h=class{constructor(t){(0,n.r)(this,t),this.ionSwipe=(0,n.d)(this,"ionSwipe",7),this.side="end"}fireSwipeEvent(){var t=this;return(0,p.Z)(function*(){t.ionSwipe.emit({side:t.side})})()}render(){const t=(0,f.b)(this),i=(0,u.p)(this.side);return(0,n.h)(n.H,{class:{[t]:!0,[`item-options-${t}`]:!0,"item-options-start":!i,"item-options-end":i}})}get el(){return(0,n.f)(this)}};let m;h.style={ios:"ion-item-options{top:0;right:0;-ms-flex-pack:end;justify-content:flex-end;display:none;position:absolute;height:100%;font-size:14px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:1}:host-context([dir=rtl]) ion-item-options{-ms-flex-pack:start;justify-content:flex-start}:host-context([dir=rtl]) ion-item-options:not(.item-options-end){right:auto;left:0;-ms-flex-pack:end;justify-content:flex-end}[dir=rtl] ion-item-options{-ms-flex-pack:start;justify-content:flex-start}[dir=rtl] ion-item-options:not(.item-options-end){right:auto;left:0;-ms-flex-pack:end;justify-content:flex-end}@supports selector(:dir(rtl)){ion-item-options:dir(rtl){-ms-flex-pack:start;justify-content:flex-start}ion-item-options:dir(rtl):not(.item-options-end){right:auto;left:0;-ms-flex-pack:end;justify-content:flex-end}}.item-options-start{right:auto;left:0;-ms-flex-pack:start;justify-content:flex-start}:host-context([dir=rtl]) .item-options-start{-ms-flex-pack:end;justify-content:flex-end}[dir=rtl] .item-options-start{-ms-flex-pack:end;justify-content:flex-end}@supports selector(:dir(rtl)){.item-options-start:dir(rtl){-ms-flex-pack:end;justify-content:flex-end}}.item-options-start ion-item-option:first-child{-webkit-padding-end:var(--ion-safe-area-left);padding-inline-end:var(--ion-safe-area-left)}.item-options-end ion-item-option:last-child{-webkit-padding-end:var(--ion-safe-area-right);padding-inline-end:var(--ion-safe-area-right)}:host-context([dir=rtl]) .item-sliding-active-slide.item-sliding-active-options-start ion-item-options:not(.item-options-end){width:100%;visibility:visible}[dir=rtl] .item-sliding-active-slide.item-sliding-active-options-start ion-item-options:not(.item-options-end){width:100%;visibility:visible}@supports selector(:dir(rtl)){.item-sliding-active-slide:dir(rtl).item-sliding-active-options-start ion-item-options:not(.item-options-end){width:100%;visibility:visible}}.item-sliding-active-slide ion-item-options{display:-ms-flexbox;display:flex;visibility:hidden}.item-sliding-active-slide.item-sliding-active-options-start .item-options-start,.item-sliding-active-slide.item-sliding-active-options-end ion-item-options:not(.item-options-start){width:100%;visibility:visible}.item-options-ios{border-bottom-width:0;border-bottom-style:solid;border-bottom-color:var(--ion-item-border-color, var(--ion-border-color, var(--ion-color-step-250, #c8c7cc)))}.item-options-ios.item-options-end{border-bottom-width:0.55px}.list-ios-lines-none .item-options-ios{border-bottom-width:0}.list-ios-lines-full .item-options-ios,.list-ios-lines-inset .item-options-ios.item-options-end{border-bottom-width:0.55px}",md:"ion-item-options{top:0;right:0;-ms-flex-pack:end;justify-content:flex-end;display:none;position:absolute;height:100%;font-size:14px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:1}:host-context([dir=rtl]) ion-item-options{-ms-flex-pack:start;justify-content:flex-start}:host-context([dir=rtl]) ion-item-options:not(.item-options-end){right:auto;left:0;-ms-flex-pack:end;justify-content:flex-end}[dir=rtl] ion-item-options{-ms-flex-pack:start;justify-content:flex-start}[dir=rtl] ion-item-options:not(.item-options-end){right:auto;left:0;-ms-flex-pack:end;justify-content:flex-end}@supports selector(:dir(rtl)){ion-item-options:dir(rtl){-ms-flex-pack:start;justify-content:flex-start}ion-item-options:dir(rtl):not(.item-options-end){right:auto;left:0;-ms-flex-pack:end;justify-content:flex-end}}.item-options-start{right:auto;left:0;-ms-flex-pack:start;justify-content:flex-start}:host-context([dir=rtl]) .item-options-start{-ms-flex-pack:end;justify-content:flex-end}[dir=rtl] .item-options-start{-ms-flex-pack:end;justify-content:flex-end}@supports selector(:dir(rtl)){.item-options-start:dir(rtl){-ms-flex-pack:end;justify-content:flex-end}}.item-options-start ion-item-option:first-child{-webkit-padding-end:var(--ion-safe-area-left);padding-inline-end:var(--ion-safe-area-left)}.item-options-end ion-item-option:last-child{-webkit-padding-end:var(--ion-safe-area-right);padding-inline-end:var(--ion-safe-area-right)}:host-context([dir=rtl]) .item-sliding-active-slide.item-sliding-active-options-start ion-item-options:not(.item-options-end){width:100%;visibility:visible}[dir=rtl] .item-sliding-active-slide.item-sliding-active-options-start ion-item-options:not(.item-options-end){width:100%;visibility:visible}@supports selector(:dir(rtl)){.item-sliding-active-slide:dir(rtl).item-sliding-active-options-start ion-item-options:not(.item-options-end){width:100%;visibility:visible}}.item-sliding-active-slide ion-item-options{display:-ms-flexbox;display:flex;visibility:hidden}.item-sliding-active-slide.item-sliding-active-options-start .item-options-start,.item-sliding-active-slide.item-sliding-active-options-end ion-item-options:not(.item-options-start){width:100%;visibility:visible}.item-options-md{border-bottom-width:0;border-bottom-style:solid;border-bottom-color:var(--ion-item-border-color, var(--ion-border-color, var(--ion-color-step-150, rgba(0, 0, 0, 0.13))))}.list-md-lines-none .item-options-md{border-bottom-width:0}.list-md-lines-full .item-options-md,.list-md-lines-inset .item-options-md.item-options-end{border-bottom-width:1px}"};const E=class{constructor(t){(0,n.r)(this,t),this.ionDrag=(0,n.d)(this,"ionDrag",7),this.item=null,this.openAmount=0,this.initialOpenAmount=0,this.optsWidthRightSide=0,this.optsWidthLeftSide=0,this.sides=0,this.optsDirty=!0,this.contentEl=null,this.initialContentScrollY=!0,this.state=2,this.disabled=!1}disabledChanged(){this.gesture&&this.gesture.enable(!this.disabled)}connectedCallback(){var t=this;return(0,p.Z)(function*(){const{el:i}=t;t.item=i.querySelector("ion-item"),t.contentEl=(0,g.f)(i),yield t.updateOptions(),t.mutationObserver=(0,k.w)(i,"ion-item-option",(0,p.Z)(function*(){yield t.updateOptions()})),t.gesture=(yield Promise.resolve().then(l.bind(l,8077))).createGesture({el:i,gestureName:"item-swipe",gesturePriority:100,threshold:5,canStart:e=>t.canStart(e),onStart:()=>t.onStart(),onMove:e=>t.onMove(e),onEnd:e=>t.onEnd(e)}),t.disabledChanged()})()}disconnectedCallback(){this.gesture&&(this.gesture.destroy(),this.gesture=void 0),this.item=null,this.leftOptions=this.rightOptions=void 0,m===this.el&&(m=void 0),this.mutationObserver&&(this.mutationObserver.disconnect(),this.mutationObserver=void 0)}getOpenAmount(){return Promise.resolve(this.openAmount)}getSlidingRatio(){return Promise.resolve(this.getSlidingRatioSync())}open(t){var i=this;return(0,p.Z)(function*(){var e;if(null===(i.item=null!==(e=i.item)&&void 0!==e?e:i.el.querySelector("ion-item")))return;const a=i.getOptions(t);a&&(void 0===t&&(t=a===i.leftOptions?"start":"end"),t=(0,u.p)(t)?"end":"start",i.openAmount<0&&a===i.leftOptions||i.openAmount>0&&a===i.rightOptions||(i.closeOpened(),i.state=4,requestAnimationFrame(()=>{i.calculateOptsWidth(),m=i.el,i.setOpenAmount("end"===t?i.optsWidthRightSide:-i.optsWidthLeftSide,!1),i.state="end"===t?8:16})))})()}close(){var t=this;return(0,p.Z)(function*(){t.setOpenAmount(0,!0)})()}closeOpened(){return(0,p.Z)(function*(){return void 0!==m&&(m.close(),m=void 0,!0)})()}getOptions(t){return void 0===t?this.leftOptions||this.rightOptions:"start"===t?this.leftOptions:this.rightOptions}updateOptions(){var t=this;return(0,p.Z)(function*(){const i=t.el.querySelectorAll("ion-item-options");let e=0;t.leftOptions=t.rightOptions=void 0;for(let o=0;o<i.length;o++){const a=i.item(o),c=void 0!==a.componentOnReady?yield a.componentOnReady():a;"start"==((0,u.p)(c.side)?"end":"start")?(t.leftOptions=c,e|=1):(t.rightOptions=c,e|=2)}t.optsDirty=!0,t.sides=e})()}canStart(t){return!("rtl"===document.dir?window.innerWidth-t.startX<15:t.startX<15)&&(m&&m!==this.el&&this.closeOpened(),!(!this.rightOptions&&!this.leftOptions))}onStart(){this.item=this.el.querySelector("ion-item");const{contentEl:t}=this;t&&(this.initialContentScrollY=(0,g.d)(t)),m=this.el,void 0!==this.tmr&&(clearTimeout(this.tmr),this.tmr=void 0),0===this.openAmount&&(this.optsDirty=!0,this.state=4),this.initialOpenAmount=this.openAmount,this.item&&(this.item.style.transition="none")}onMove(t){this.optsDirty&&this.calculateOptsWidth();let e,i=this.initialOpenAmount-t.deltaX;switch(this.sides){case 2:i=Math.max(0,i);break;case 1:i=Math.min(0,i);break;case 3:break;case 0:return;default:console.warn("invalid ItemSideFlags value",this.sides)}i>this.optsWidthRightSide?(e=this.optsWidthRightSide,i=e+.55*(i-e)):i<-this.optsWidthLeftSide&&(e=-this.optsWidthLeftSide,i=e+.55*(i-e)),this.setOpenAmount(i,!1)}onEnd(t){const{contentEl:i,initialContentScrollY:e}=this;i&&(0,g.r)(i,e);const o=t.velocityX;let a=this.openAmount>0?this.optsWidthRightSide:-this.optsWidthLeftSide;const c=this.openAmount>0==!(o<0),y=Math.abs(o)>.3,O=Math.abs(this.openAmount)<Math.abs(a/2);W(c,y,O)&&(a=0);const j=this.state;this.setOpenAmount(a,!0),32&j&&this.rightOptions?this.rightOptions.fireSwipeEvent():64&j&&this.leftOptions&&this.leftOptions.fireSwipeEvent()}calculateOptsWidth(){this.optsWidthRightSide=0,this.rightOptions&&(this.rightOptions.style.display="flex",this.optsWidthRightSide=this.rightOptions.offsetWidth,this.rightOptions.style.display=""),this.optsWidthLeftSide=0,this.leftOptions&&(this.leftOptions.style.display="flex",this.optsWidthLeftSide=this.leftOptions.offsetWidth,this.leftOptions.style.display=""),this.optsDirty=!1}setOpenAmount(t,i){if(void 0!==this.tmr&&(clearTimeout(this.tmr),this.tmr=void 0),!this.item)return;const{el:e}=this,o=this.item.style;if(this.openAmount=t,i&&(o.transition=""),t>0)this.state=t>=this.optsWidthRightSide+30?40:8;else{if(!(t<0))return e.classList.add("item-sliding-closing"),this.gesture&&this.gesture.enable(!1),this.tmr=setTimeout(()=>{this.state=2,this.tmr=void 0,this.gesture&&this.gesture.enable(!this.disabled),e.classList.remove("item-sliding-closing")},600),m=void 0,void(o.transform="");this.state=t<=-this.optsWidthLeftSide-30?80:16}o.transform=`translate3d(${-t}px,0,0)`,this.ionDrag.emit({amount:t,ratio:this.getSlidingRatioSync()})}getSlidingRatioSync(){return this.openAmount>0?this.openAmount/this.optsWidthRightSide:this.openAmount<0?this.openAmount/this.optsWidthLeftSide:0}render(){const t=(0,f.b)(this);return(0,n.h)(n.H,{class:{[t]:!0,"item-sliding-active-slide":2!==this.state,"item-sliding-active-options-end":0!=(8&this.state),"item-sliding-active-options-start":0!=(16&this.state),"item-sliding-active-swipe-end":0!=(32&this.state),"item-sliding-active-swipe-start":0!=(64&this.state)}})}get el(){return(0,n.f)(this)}static get watchers(){return{disabled:["disabledChanged"]}}},W=(t,i,e)=>!i&&e||t&&i;E.style="ion-item-sliding{display:block;position:relative;width:100%;overflow:hidden;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}ion-item-sliding .item{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.item-sliding-active-slide .item{position:relative;-webkit-transition:-webkit-transform 500ms cubic-bezier(0.36, 0.66, 0.04, 1);transition:-webkit-transform 500ms cubic-bezier(0.36, 0.66, 0.04, 1);transition:transform 500ms cubic-bezier(0.36, 0.66, 0.04, 1);transition:transform 500ms cubic-bezier(0.36, 0.66, 0.04, 1), -webkit-transform 500ms cubic-bezier(0.36, 0.66, 0.04, 1);opacity:1;z-index:2;pointer-events:none;will-change:transform}.item-sliding-closing ion-item-options{pointer-events:none}.item-sliding-active-swipe-end .item-options-end .item-option-expandable{padding-left:100%;-ms-flex-order:1;order:1;-webkit-transition-duration:0.6s;transition-duration:0.6s;-webkit-transition-property:padding-left;transition-property:padding-left}:host-context([dir=rtl]) .item-sliding-active-swipe-end .item-options-end .item-option-expandable{-ms-flex-order:-1;order:-1}[dir=rtl] .item-sliding-active-swipe-end .item-options-end .item-option-expandable{-ms-flex-order:-1;order:-1}@supports selector(:dir(rtl)){.item-sliding-active-swipe-end .item-options-end .item-option-expandable:dir(rtl){-ms-flex-order:-1;order:-1}}.item-sliding-active-swipe-start .item-options-start .item-option-expandable{padding-right:100%;-ms-flex-order:-1;order:-1;-webkit-transition-duration:0.6s;transition-duration:0.6s;-webkit-transition-property:padding-right;transition-property:padding-right}:host-context([dir=rtl]) .item-sliding-active-swipe-start .item-options-start .item-option-expandable{-ms-flex-order:1;order:1}[dir=rtl] .item-sliding-active-swipe-start .item-options-start .item-option-expandable{-ms-flex-order:1;order:1}@supports selector(:dir(rtl)){.item-sliding-active-swipe-start .item-options-start .item-option-expandable:dir(rtl){-ms-flex-order:1;order:1}}"},4237:(z,b,l)=>{l.d(b,{c:()=>w,g:()=>u,h:()=>n,o:()=>k});var p=l(5861);const n=(s,r)=>null!==r.closest(s),w=(s,r)=>"string"==typeof s&&s.length>0?Object.assign({"ion-color":!0,[`ion-color-${s}`]:!0},r):r,u=s=>{const r={};return(s=>void 0!==s?(Array.isArray(s)?s:s.split(" ")).filter(d=>null!=d).map(d=>d.trim()).filter(d=>""!==d):[])(s).forEach(d=>r[d]=!0),r},g=/^[a-z][a-z0-9+\-.]*:/,k=function(){var s=(0,p.Z)(function*(r,d,x,v){if(null!=r&&"#"!==r[0]&&!g.test(r)){const h=document.querySelector("ion-router");if(h)return d?.preventDefault(),h.push(r,x,v)}return!1});return function(d,x,v,h){return s.apply(this,arguments)}}()}}]);