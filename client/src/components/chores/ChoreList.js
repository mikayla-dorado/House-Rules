import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getChores, deleteChore } from "../../managers/choreManagers"
import { Button, Table } from "reactstrap"

export const ChoreList = ({ loggedInUser }) => {
    const [chores, setChores] = useState([])


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

    return (
        <div>
            <h2>Chores</h2>
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