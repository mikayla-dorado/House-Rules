// import { useEffect, useState } from "react"
// import { useNavigate, useParams } from "react-router-dom"
// import { getChoreById } from "../../managers/choreManagers"
// import { getUserProfiles } from "../../managers/userProfileManager"
// import { Table } from "reactstrap"

// export const ChoreDetails = () => {
//     const [chore, setChore] = useState([])
//     const [users, setUsers] = useState([])
//     const [currentAssignees, setCurentAssignees] = useState([])
//     const [recentCompletion, setRecentCompletion] = useState(null)

//     const { id } = useParams();
//     const navigate = useNavigate()

//     useEffect(() => {
//         getChoreById(id).then(obj => {
//             setChore(obj)
//             setCurentAssignees(obj?.choreAssignments?.map(ca => ca.userProfileId) || [])
//            //setRecentCompletion(obj?.recentCompletion || null)
//         })
//     }, [id])

 
//     useEffect(() => {
//         getUserProfiles().then(array => setUsers(array))
//     })

//     return(
//         <div>
//             <h2>Chore Details</h2>
//             <Table>
//                 <thead>
//                     <tr>
//                         <th>Name</th>
//                         <th>Difficulty</th>
//                         <th>Frequency</th>
//                         <th>Current Assignee</th>
//                         <th>Recent Completion</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr key={chore.id}>
//                         <td>{chore.name}</td>
//                         <td>{chore.difficulty}</td>
//                         <td>{chore.choreFrequencyDays}</td>
//                         {/* <td>{currentAssignees.map(assigneeId => {
//                             const user = users.find(user => user.id === assigneeId);
//                             return user ? user.firstName : "Unknown User";
//                         }).join(", ")}</td>
//                         <td>{recentCompletion ? recentCompletion.date : "No recent completion"}</td> */}
//                     </tr> 
//                 </tbody>
//             </Table>
//         </div>
//     )
// }

import { useEffect, useState } from "react"
import { assignChore, getChoreById, unassignChore, updateChore } from "../../managers/choreManagers"
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { getUserProfiles } from "../../managers/userProfileManager";

export const ChoreDetails = () => {
  const [chore, setChore] = useState([])
  const [users, setUsers] = useState([])
  const [assignedUsers, setAssignedUsers] = useState([])

  const { id } = useParams();
  const navigate = useNavigate()

  useEffect(() => {
    getChoreById(id).then(obj => {
      setChore(obj)
      setAssignedUsers(obj?.choreAssignments?.map(ca => ca.userProfileId) || [])
    })
  }, [id])

  useEffect(() => {
    getUserProfiles().then(arr => setUsers(arr))
  }, [])


  const mostRecentCompletionDate = chore?.choreCompletions && chore.choreCompletions.length > 0
    ? new Date(Math.max(...chore.choreCompletions.map(cc => new Date(cc.completedOn))))
    : null;

  const handleCheckBox = async (userId) => {
    const isAssigned = assignedUsers.includes(userId)

    try {
      if (isAssigned) {
        await unassignChore(chore.id, userId);
      } else {
        await assignChore(chore.id, userId);
      }

      if (isAssigned) {
        setAssignedUsers(assignedUsers.filter(id => id !== userId));
      } else {
        setAssignedUsers([...assignedUsers, userId]);
      }


      getChoreById(id).then(obj => setChore(obj));

    } catch (error) {
      console.error("Error updating:", error);
    }
  }

  const handleSubmitBtn = (event) => {
    event.preventDefault()

    const updatedChore = {
      id: chore.id,
      name: chore.name,
      difficulty: chore.difficulty,
      choreFrequencyDays: chore.choreFrequencyDays,
      choreAssignments: [],
      choreCompletions: []
    }
    updateChore(updatedChore).then(() => navigate("/chores"))
  }

  return (
    <>
      <h2>Chore Details</h2>
      <Form className="chore-details">
        <FormGroup>
          <Label>Name</Label>
          <Input
            type="text"
            name="name"
            value={chore.name}
            onChange={(event) => {
              setChore(prevChore => ({
                ...prevChore,
                [event.target.name]: event.target.value
              }))
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label>Difficulty</Label>
          <Input
            type="text"
            name="difficulty"
            value={chore.difficulty}
            onChange={(event) => {
              setChore(prevChore => ({
                ...prevChore,
                [event.target.name]: parseInt(event.target.value)
              }))
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label>Frequency</Label>
          <Input
            type="text"
            name="choreFrequencyDays"
            value={chore.choreFrequencyDays}
            onChange={(event) => {
              setChore(prevChore => ({
                ...prevChore,
                [event.target.name]: parseInt(event.target.value)
              }))
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label>Current Assignees</Label>
          {users.map(u => {
            return (
              <div key={u.id}>
                <input
                  type="checkbox"
                  name={`user_${u.id}`}
                  id={`user_${u.id}`}
                  checked={assignedUsers.includes(u.id)}
                  onChange={() => handleCheckBox(u.id)}
                />
                <label className="assignee-label" htmlFor={`user_${u.id}`}>{u.firstName} {u.lastName}</label>
              </div>
            )
          })}
        </FormGroup>
        <FormGroup>
          <Label>Most Recent Completion</Label>
          <div>{mostRecentCompletionDate ? mostRecentCompletionDate.toISOString().slice(0, 10) : ''}</div>
        </FormGroup>
      </Form>
      <Button color="danger" onClick={event => handleSubmitBtn(event)}>Submit</Button>
    </>
  )
}
//does this need to be a form?