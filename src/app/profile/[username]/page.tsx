export default function Page({ params }: { params: { username: string } }) {
    return (
      <div>
        <h1>Hello From Profile Page from {params.username}</h1>
      </div>
    )
  }
