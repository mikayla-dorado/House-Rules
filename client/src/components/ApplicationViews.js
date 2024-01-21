import { Route, Routes } from "react-router-dom";
import { AuthorizedRoute } from "./auth/AuthorizedRoute";
import { Home } from "./Home";
import Login from "./auth/Login";
import Register from "./auth/Register";
import { UserProfileList } from "./userProfiles/UserProfileList";
import { UserProfileDetails } from "./userProfiles/UserProfileDetails";
import { ChoreList } from "./chores/ChoreList";
import { ChoreDetails } from "./chores/ChoreDetails";
import { CreateChore } from "./chores/CreateChore"
import { ProfileChore } from "./chores/ProfileChores";

export default function ApplicationViews({ loggedInUser, setLoggedInUser }) {
  return (
    <Routes>
      <Route path="/">
        <Route
          index
          element={<AuthorizedRoute loggedInUser={loggedInUser}>
            <Home />
          </AuthorizedRoute>
          }
        />
        <Route path="userprofiles">
          <Route index
            element={<AuthorizedRoute roles={["Admin"]} loggedInUser={loggedInUser}>
              <UserProfileList />
            </AuthorizedRoute>
            }
          />
          <Route path=":id"
            element={<AuthorizedRoute roles={["Admin"]} loggedInUser={loggedInUser}>
              <UserProfileDetails />
            </AuthorizedRoute>}
          />
        </Route>
        <Route path="chores">
          <Route index element={<AuthorizedRoute loggedInUser={loggedInUser}>
            <ChoreList loggedInUser={loggedInUser} />
          </AuthorizedRoute>
          }
          />
          <Route path=":id"
            element={<AuthorizedRoute loggedInUser={loggedInUser} roles={["Admin"]}>
              <ChoreDetails loggedInUser={loggedInUser} />
            </AuthorizedRoute>
            }
          />
          <Route path="create"
          element={<AuthorizedRoute loggedInUser={loggedInUser} roles={["Admin"]}>
            <CreateChore loggedInUser={loggedInUser} />
          </AuthorizedRoute>
          }
          />
          <Route path="userschores" element={<AuthorizedRoute loggedInUser={loggedInUser}>
            <ProfileChore loggedInUser={loggedInUser} />
          </AuthorizedRoute>
          }
          />
        </Route>
        <Route
          path="login"
          element={<Login setLoggedInUser={setLoggedInUser} />}
        />
        <Route
          path="register"
          element={<Register setLoggedInUser={setLoggedInUser} />}
        />
      </Route>
      <Route path="*" element={<p>Whoops, nothing here...</p>} />
    </Routes>
  );
}