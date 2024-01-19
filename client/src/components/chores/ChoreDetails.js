import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getChoreById } from "../../managers/choreManagers"

export const ChoreDetails = () => {
    const [chore, setChore] = useState([])
    const [users, setUsers] = useState([])
    const [currentAssignee, setCurentAssigne] = useState([])

    const { id } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        getChoreById(id).then(obj => {
            setChore(obj)
            setCurentAssigne(obj?.choreAssignments?.map(ca => ca.userProfileId) || [])
        })
    }, [id])

    
}