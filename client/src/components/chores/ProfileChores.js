import { useEffect, useState } from "react"
import { createChoreComplete, getChores } from "../../managers/choreManagers"
import { Link } from "react-router-dom";
import { Button, Table } from "reactstrap";

export const ProfileChore = ( { loggedInUser }) => {
    const [userChores, setUserChores] = useState([])
    const [chores, setChores] = useState([])

    const getAndSetChores = () => {
        getChores().then(array => setChores(array))
    }

    useEffect(() => {
        getAndSetChores()
    }, [])

    useEffect(() => {
        const foundUserChores = chores?.filter(c => c.choreAssignments.some(ca => ca.userProfileId === loggedInUser.id && c.isOverdue))
        setUserChores(foundUserChores)
      }, [chores, loggedInUser])
    
      const handleCompleteBtn = (event, choreId) => {
        event.preventDefault()
    
    
        const userProfileToSend = {
          id: loggedInUser.id,
          firstName: loggedInUser.firstName,
          lastName: loggedInUser.lastName,
          address: loggedInUser.address,
          identityUserId: loggedInUser.identityUserId,
          choreAssignments: [],
          choreCompletions: [],
          identityUser: {}
        }
        createChoreComplete(choreId, userProfileToSend).then(() => getAndSetChores())
      }
    
      return (
        <>
          <h2>My Chores</h2>
          <Table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Difficulty</th>
                <th>Frequency</th>
              </tr>
            </thead>
            <tbody>
              {userChores.map((c) => (
                <tr key={c.id} >
                  <th scope="row">{`${c.id}`}</th>
                  <td>{c.name}</td>
                  <td>{c.difficulty}</td>
                  <td>{c.choreFrequencyDays}</td>
                  <td>
                    <Button color="info" onClick={event => handleCompleteBtn(event, c.id)}>Complete Chore</Button>
                    {loggedInUser.roles.includes("Admin") ? (
                      <>
                        <Link to={`${c.id}`}>
                          Details
                        </Link>
                      </>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )
}