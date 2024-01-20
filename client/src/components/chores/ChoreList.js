import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getChores, deleteChore, createChoreComplete } from "../../managers/choreManagers"
import { Button, Table } from "reactstrap"

export const ChoreList = ({ loggedInUser }) => {
    const [chores, setChores] = useState([])
    const navigate = useNavigate()


    const getAndSetChores = () => {
        getChores().then(array => setChores(array))
    }

    useEffect(() => {
        getAndSetChores()
    }, [])

    const handleDeleteBtn = (event, id) => {
        event.preventDefault()

        deleteChore(id).then(() => getAndSetChores())
    }

    const handleCreateChoreBtn = (event) => {
        event.preventDefault()

        navigate("/create")
    }

    const handleCompleteBtn = (event, choreId) => {
        event.preventDefault()

        const userProfileToSend = {
            //id firstname lastname address identityuserid
            id: loggedInUser.id,
            firstName: loggedInUser.firstName,
            lastName: loggedInUser.lastName,
            address: loggedInUser.address,
            identityUserId: loggedInUser.identityUserId,
            choreAssignments: [],
            choreCompletions: [],
            identityUser: {}
          }
          createChoreComplete(choreId, userProfileToSend)
    }

    return (
        <div>
            <h2>Chores</h2>
            <Button color="success" onClick={handleCreateChoreBtn}>Create A New Chore</Button>
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
                    {chores.map((c) => (
                        <tr key={c.id}>
                            <th scope="row">{`${c.id}`}</th>
                            <td>{c?.name}</td>
                            <td>{c?.difficulty}</td>
                            <td>{c?.choreFrequencyDays}</td>
                            <td>
                            <Button color="info" onClick={e => handleCompleteBtn(e, c.id)}>Complete</Button>
                                {loggedInUser.roles.includes("Admin") ? (
                                    <>
                                        <Button
                                            color="danger"
                                            onClick={event => handleDeleteBtn(event, c.id)}>
                                            Delete
                                        </Button>
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
        </div >
    )
}