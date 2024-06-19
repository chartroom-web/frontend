export function getonline(memberlist: Array<any>, myid: number): Array<any> {
  const onlineMemberList: any[] = []
  memberlist.forEach((user) => {
    if (user.id === myid) return
    onlineMemberList.push(user)
  })
  return onlineMemberList
}
