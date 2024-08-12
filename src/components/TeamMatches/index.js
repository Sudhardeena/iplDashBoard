// Write your code here
import './index.css'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {PieChart, Cell, Pie, Legend} from 'recharts'
import LatestMatch from '../LatestMatch'
import MatchCard from '../MatchCard'

class TeamMatches extends Component {
  state = {teamMatchesDetails: {}, isLoading: true}

  componentDidMount = () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.getTeamMatchesDetails(id)
  }

  getTeamMatchesDetails = async id => {
    const response = await fetch(`https://apis.ccbp.in/ipl/${id}`)
    const jsonData = await response.json()
    // console.log(jsonData)
    const teamBannerUrl = jsonData.team_banner_url
    let latestMatchDetails = jsonData.latest_match_details
    latestMatchDetails = {
      competingTeam: latestMatchDetails.competing_team,
      competingTeamLogo: latestMatchDetails.competing_team_logo,
      date: latestMatchDetails.date,
      firstInnings: latestMatchDetails.first_innings,
      id: latestMatchDetails.id,
      manOfTheMatch: latestMatchDetails.man_of_the_match,
      matchStatus: latestMatchDetails.match_status,
      result: latestMatchDetails.result,
      secondInnings: latestMatchDetails.second_innings,
      umpires: latestMatchDetails.umpires,
      venue: latestMatchDetails.venue,
    }
    let recentMatches = jsonData.recent_matches

    recentMatches = recentMatches.map(each => ({
      competingTeam: each.competing_team,
      competingTeamLogo: each.competing_team_logo,
      date: each.date,
      firstInnings: each.first_innings,
      id: each.id,
      manOfTheMatch: each.man_of_the_match,
      matchStatus: each.match_status,
      result: each.result,
      secondInnings: each.second_innings,
      umpires: each.umpires,
      venue: each.venue,
    }))

    this.setState({
      teamMatchesDetails: {
        teamBannerUrl,
        latestMatchDetails,
        recentMatches,
      },
      isLoading: false,
    })
  }

  renderPiechart = () => {
    const {teamMatchesDetails} = this.state
    let data = [
      {name: 'Won', value: 0},
      {name: 'Lost', value: 0},
      {name: 'Drawn', value: 0},
    ]
    const {latestMatchDetails, recentMatches} = teamMatchesDetails
    const {matchStatus} = latestMatchDetails
    console.log(teamMatchesDetails)
    data = data.map(el => {
      if (el.name === matchStatus) {
        return {...el, value: 1}
      }
      return el
    })
    let recentMatWon = 0
    let recentMatLost = 0
    let recentMatDrawn = 0
    const l = recentMatches.length
    for (let i = 0; i < l; i += 1) {
      if (recentMatches[i].matchStatus === 'Won') {
        recentMatWon += 1
      } else if (recentMatches[i].matchStatus === 'Lost') {
        recentMatLost += 1
      } else {
        recentMatDrawn += 1
      }
    }
    data[0].value += recentMatWon
    data[1].value += recentMatLost
    data[2].value += recentMatDrawn
    const COLORS = ['green', 'red', 'yellow']
    return (
      <PieChart width={350} height={250}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={50}
          innerRadius={30}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    )
  }

  onClickBackBtn = () => {
    const {history} = this.props
    history.replace('/')
  }

  render() {
    const {teamMatchesDetails, isLoading} = this.state
    const {
      teamBannerUrl,
      latestMatchDetails,
      recentMatches,
    } = teamMatchesDetails

    return (
      <div className="team-matches-container">
        {isLoading ? (
          <div>
            <Loader type="Oval" color="#ffffff" height={50} width={50} />
          </div>
        ) : (
          <div className="content-div">
            <img className="banner-img" src={teamBannerUrl} alt="team banner" />
            <p className="latest-matches-title">Latest Matches</p>
            <LatestMatch latestMatchDetails={latestMatchDetails} />
            {this.renderPiechart()}
            <ul className="recent-matches-list">
              {recentMatches.map(each => (
                <MatchCard key={each.id} matchcardDetails={each} />
              ))}
            </ul>
            <button
              type="button"
              className="back-btn"
              onClick={this.onClickBackBtn}
            >
              Back
            </button>
          </div>
        )}
      </div>
    )
  }
}

export default TeamMatches
