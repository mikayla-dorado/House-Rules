import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getUserProfileById } from "../../managers/userProfileManager"
import { Table } from "reactstrap"

export const UserProfileDetails = () => {
    const [userProfile, setUserProfile] = useState({})

    const { id } = useParams();

    useEffect(() => {
        if (id) {
            getUserProfileById(id).then(obj => setUserProfile(obj))
        }
    }, [id])

    return (
        <div>
            <h2>User Details</h2>
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Chores Assigned</th>
                        <th>Chores Completed</th>
                    </tr>
                </thead>
                <tbody>
                    {/* {userProfiles.map((up) => ( */}
                    <tr key={userProfile.id}>
                        <th scope="row">{`${userProfile.firstName} ${userProfile.lastName}`}</th>
                        <td>{userProfile.address}</td>
                        <td>{userProfile.email}</td>
                        <td>{userProfile.userName}</td>
                        <td>{userProfile?.choreAssingments?.map((up) => {
                            return (
                                <div key={up.id}>{up.chore.name}</div>
                            )
                        })}
                        </td>
                        <td>
                            {userProfile?.choreCompletions?.map((cc) => {
                                return (
                                    <div key={cc.id}>
                                        <div>{cc.chore.name} was completed on {cc.completedOn.slice(0,10)}</div>
                                    </div>
                                )
                            })}
                        </td>
                    </tr>
                </tbody>
            </Table>
        </div>
    )
}