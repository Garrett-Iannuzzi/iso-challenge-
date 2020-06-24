import React, { Component } from 'react';
import Nav from '../Nav/Nav';
import { Route } from 'react-router-dom';
import { getPlayers, getNextPlayerPage } from '../../apiCalls';
import './App.scss';
import { connect } from 'react-redux';
import { getPlayerInfo } from '../../actions/actions';
import HomeContainer from '../../Containers/HomeContainer/HomeContainer';
import Rules from '../../Components/Rules/Rules';
import GameContainer from '../../Containers/GameContainer/GameContainer';
import ScoreBoard from '../../Containers/ScoreBoard/ScoreBoard';
import PropTypes from 'prop-types';
import Loader from '../Loader/Loader';


export class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pageCount: 0
    }
  }

  async componentDidMount() {
    await getPlayers(1)
    .then(res => {
      this.props.playerInfo(res.data)
      getNextPlayerPage(res, this.props.playerInfo)
    })
    .catch(err => console.log(err))
  }

  render() {
    this.state.pageCount++
    
    return ( 
      <body>
        <Route exact path='/' render={({ history }) => 
          <main>
            <Nav />
            {/* {console.log(this.state.pageCount)} */}
            {this.state.pageCount === 30 ? <HomeContainer history={ history } /> : <Loader />}
          </main>
          }
          />
        <Route path='/rules' render={() =>
          <main>
            <Nav />
            <Rules />
          </main>
          }
        />
        <Route path='/game' render={() =>
          <main>
            <Nav />
            {this.props.playerInfo.length ? <GameContainer /> : <Loader />}
          </main>
          }
        />
        <Route path='/score' render={() =>
          <main>
            <Nav />
            {this.props.statsInfoOne.length && this.props.statsInfoTwo.length ? <ScoreBoard /> : <Loader />}
          </main>
          }
        />
      </body>
    );  
  }
}

export const mapStateToProps = state => ({
  playerInfo: state.playerInfo,
  statsInfoOne: state.statsInfoOne,
  statsInfoTwo: state.statsInfoTwo
})

export const mapDispatchToProps = dispatch => ({
  playerInfo: players => dispatch(getPlayerInfo(players)),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)

App.propTypes = {
  playerInfo: PropTypes.func
}