import React, { Component } from 'react';
import { ANON_URL } from '../config';

class OnGoingGame extends Component {

    createPlayerRow = (playerData) =>{
        const { game, group: { players: groupPlayers }  } = this.props;
        const playersCount = game.playersData.length;

        const { buyIn, cashOut, playerId} = playerData;
        const { name, imageUrl='' } = groupPlayers.find(p=>p.id === playerId);
        const bottomLine = (parseInt(cashOut) - parseInt(buyIn));
        const buyInValue = `${buyIn>0?'+':''}${buyIn}₪`;
        const cashOutValue = `${cashOut>0?'+':''}${cashOut}₪`;
        const bottomLineValue = `${bottomLine>0?'+':''}${bottomLine}₪`;

        const onImageError = (ev)=>{
            if (imageUrl && imageUrl.length>1 && !ev.target.secondTry){
                ev.target.secondTry = true;
                ev.target.src=imageUrl;
            }else{
                ev.target.src=ANON_URL;
            }
        };

        let imgHeight = (60 / playersCount)-0.5;
        imgHeight = imgHeight>16 ? 15 : imgHeight;
        const imageStyle = {height: `${imgHeight}vh`};
        return (
            <div className="col-xs-12 activeGamePlayerRow">
                <div className="col-xs-2 col-md-1">
                     <img alt={name} className="activeGameImage" style={imageStyle}  src={imageUrl || ANON_URL}  onError={onImageError} />
                </div>
                <div className="col-xs-4 col-md-5 centeredText">
                    { name }
                </div>
                <div className="col-xs-2"> {buyInValue}</div>
                <div className="col-xs-2"> {cashOutValue}</div>
                <div className={`col-xs-2 ${bottomLine>0?'balanceWithCurrencyPositive':'balanceWithCurrencyNegative'}`}> {bottomLineValue}</div>
            </div>
        );
    }

    getAsPokerTable = () =>{
        const { game, group: { players:  groupPlayers}} = this.props;
        const players = game.playersData.map(player=>{
            let all = player.buyIn;
            const blues =  (50 * (Math.floor(all/50)));
            all = all - blues;
            const hasBlue = blues>0;
            const greens =  (25 * (Math.floor(all/25)));
            all = all - greens;
            const hasGreen = greens>0;
            const blacks =  (10 * (Math.floor(all/10)));
            all = all - blacks;
            const hasBlack = blacks>0;
            const reds =  (5 * (Math.floor(all/5)));
            all = all - reds;
            const hasRed = reds>0;
            const hasGray = all >0;
            const { name, imageUrl } = groupPlayers.find(p=>p.id === player.playerId);
            return {...player, hasBlue,hasGreen,hasBlack,hasRed,hasGray, name, imageUrl}
        }).map((player, index)=>{
            const onImageError = (ev)=>{
                if (player.imageUrl && player.imageUrl.length>1 && !ev.target.secondTry){
                    ev.target.secondTry = true;
                    ev.target.src=player.imageUrl;
                }else{
                    ev.target.src=ANON_URL;
                }
            };
            const image =  <img alt={player.name} className="activeGameCircleImage" src={player.imageUrl || ANON_URL}  onError={onImageError} />
            const positive = player.cashOut - player.buyIn > 0;
            const balance = player.cashOut ? `${positive ? '+':''}${player.cashOut - player.buyIn}₪` : '';
                return  (<div>
                        <div className={`player player-${(index + 1)}`}>
                            <div className="balance-value">{balance}</div>
                           <div className="bank">
                               <div className="bank-value">{ player.buyIn}</div>
                               {player.hasBlue ? <div className="jetons v-50"></div> :<div/>}
                               {player.hasGreen ?<div className="jetons v-25"></div> :<div/>}
                               {player.hasBlack ?<div className="jetons v-10"></div> :<div/>}
                               {player.hasRed ?<div className="jetons v-5"></div> :<div/>}
                               {player.hasGray ?<div className="jetons v-1"></div> :<div/>}
                           </div>
                           <div className="avatar">{image}</div>
                           <div className="name">{player.name.split(' ')[0]}</div>

                        </div>
                    </div>);
        });

       return (
           <div className="vue-container">
               <div className="table">
                   <div className="players">
                       {players}
                   </div>
                </div>
           </div>);
    };

    onBackClicked = ()=>{
        if ( this.interval ){
            clearInterval(this.interval);
            this.interval = null;
        }
        this.props.onBack();
    };

    render = () =>{
        if (!this.interval ){
            this.interval = setInterval(this.props.updateOnProgressGame,10000);
        }

        const {onBack, game} = this.props;
        if (!game){
            return (
                <div>
                    no game
                    <div className="backButton">
                        <button className="button" onClick={onBack}> Back</button>
                    </div>
                </div>);
        }
        const totalBuyIn = game.playersData.map(pd=>pd.buyIn).reduce((total, num)=>  total + num, 0);

        const players =  this.getAsPokerTable() ;
        const isMobile = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

        return (<div className="popupOuter">
            <div className="viewGamePopupInner">
                <div>
                    <h3>Ongoing game. {game.date.AsGameName()}</h3>
                    <h4>{game.playersData.length} Players. {game.description} </h4>
                    <br/>
                    <div className="backButton">
                        <button className="button" onClick={this.onBackClicked}> Back</button>
                    </div>

                </div>
                { isMobile ? <span/> : players}
                 <div className="potInTheMiddle">{totalBuyIn}₪ In Pot</div>


            </div>
        </div>);

    }
}

export default OnGoingGame;

