import UserInfo from '../components/UserInfo'

export default function UserInfoPage({ userInfo }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">User Info</h2>
      <UserInfo info={userInfo} />
    </div>
  )
}