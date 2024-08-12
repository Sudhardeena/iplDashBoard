// Write your code here
import './index.css'

const MatchCard = props => {
  const {matchcardDetails} = props
  const {
    competingTeamLogo,
    competingTeam,
    result,
    matchStatus,
  } = matchcardDetails
  return (
    <li className="recent-match-item">
      <img
        className="competite-recent-team-logo"
        src={competingTeamLogo}
        alt={`competing team ${competingTeam}`}
      />
      <p>{competingTeam}</p>
      <p>{result}</p>
      <p>{matchStatus}</p>
    </li>
  )
}

export default MatchCard
