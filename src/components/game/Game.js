import React, { Component } from 'react'
import { parseCardValues } from '../../functionalComp/HandValueFunctions'
import Dealer from '../dealer/Dealer'
import Players from '../players/Players'
import DefaultBtn from '../buttons/DefaultBtn'
import BeforeDeal from '../beforeDeal/BeforeDeal'
import './Game.css'

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handOpen: false,
      playerIndexTurn: 0,
      dealerTurn: false,
      numberOfDecks: 1,
      dealerGamePoints: 0,
      dealerHandPoints: [],
      numberOfPlayers: 4,
      bustArr: [],
      playersHandPoints: [],
      playersGamePoints: [],
      cardsDealt: [],
      allPlayersCards: [],
      dealersCards: []
    };
  }

  componentDidMount() {
    let playerIteration = this.state.numberOfPlayers
    let bustArrToSet = []
    let playersHandPointsArrToSet = []
    let playersGamePointsArrToSet = []
    for (let i = 0; i < playerIteration; i++) {
      bustArrToSet.push(false)
      playersHandPointsArrToSet.push(0)
      playersGamePointsArrToSet.push(0)
    }
    this.setState({
      bustArr: bustArrToSet,
      playersHandPoints: playersHandPointsArrToSet,
      playersGamePoints: playersGamePointsArrToSet
    })
  }

  newDeal = () => {
    let openingDeal = (this.state.numberOfPlayers + 1) * 2;
    let deckOfCardsUrl = `https://deckofcardsapi.com/api/deck/hrosz2hydqqk/draw/?count=${openingDeal}`

    function status(response) {
      if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
      } else {
        return Promise.reject(new Error(response.statusText));
      }
    }

    function json(response) {
      return response.json();
    }

    fetch(deckOfCardsUrl)
      .then(status)
      .then(json)
      .then(data => {
        let totalIteration = this.state.numberOfPlayers + 1
        let playerCards = []
        for (let i = 0; i < totalIteration; i++) {
          playerCards.push([data.cards[i], data.cards[i + totalIteration]])
        }
        this.setState({
          cardsDealt: data.cards,
          allPlayersCards: playerCards.slice(0, playerCards.length - 1),
          dealersCards: playerCards[playerCards.length - 1],
          handOpen: true
        })
      })
      .catch(function(error) {
        console.log("Request failed", error);
      })
  }

  hitNext = () => {
    let deckOfCardsUrl =
      "https://deckofcardsapi.com/api/deck/hrosz2hydqqk/draw/?count=1"

    function status(response) {
      if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
      } else {
        return Promise.reject(new Error(response.statusText))
      }
    }

    function json(response) {
      return response.json()
    }

    fetch(deckOfCardsUrl)
      .then(status)
      .then(json)
      .then(data => {
        const { playerIndexTurn, allPlayersCards } = this.state
        let addedCard = allPlayersCards[playerIndexTurn].concat(
          data.cards[0]
        )

        let playerPoints = parseCardValues(addedCard).reduce((acc, currentVal) => acc + currentVal)
        let adjustedPlayersCards = allPlayersCards.map((item, key) =>
          key !== playerIndexTurn ? item : (item = addedCard)
        )
        this.setState({
          allPlayersCards: adjustedPlayersCards,
          playersHandPoints: playerPoints
        })
      })
      .catch(function(error) {
        console.log("Request failed", error)
      })
  }

  holdHand = () => {
    let nextPlayerTurn = this.state.playerIndexTurn + 1
    this.setState({
      playerIndexTurn: this.state.playerIndexTurn + 1 === this.state.numberOfPlayers ? 0 : nextPlayerTurn
    })
  }

  // If you are not getting an opening deal then shuffle the deck (API Quirk)
  shuffleDeck = () => {
    fetch("https://deckofcardsapi.com/api/deck/hrosz2hydqqk/shuffle/")
  }

  consoleState = () => {
    console.log(this.state)
  }

  render() {
    return (
      <div className="game-wrap">
        <h1>Black Jack</h1>
        <DefaultBtn
          txtParent={"Console State"}
          callBackParent={this.consoleState}
        />
        {this.state.cardsDealt.length === 0 ? (
          <BeforeDeal
            dealParent={this.newDeal}
            shuffleDeckParent={this.shuffleDeck}
          />
        ) : (
          <div>
            <Dealer dealerCardsGame={this.state.dealersCards} />
            <Players
              numPlayersGame={this.state.numberOfPlayers}
              playersCardsGame={this.state.allPlayersCards}
              hitNextGame={this.hitNext}
              holdHandGame={this.holdHand}
              playersTurnIndexGame={this.state.playerIndexTurn}
            />
          </div>
        )}
      </div>
    )
  }
}
