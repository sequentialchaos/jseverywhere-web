import React from 'react'
import ReactMarkdown from 'react-markdown'
import { format } from 'date-fns'
import styled from 'styled-components'

import { useQuery } from '@apollo/client'
import NoteUser from './NoteUser'
import { IS_LOGGED_IN } from '../gql/query'

// Keep notes from extending wider than 800px:
const StyledNote = styled.article`
  max-width: 800px;
  margin: 0 auto;
  background-color: rgba(127, 127, 127, 0.03);
`

// Style the note metadata:
const MetaData = styled.div`
  @media (min-width: 500px) {
    display: flex;
    align-items: top;
  }
`

// add some space between the avatar and meta info
const MetaInfo = styled.div`
  padding-right: 1em;
`

// align 'UserActions' to the right on large screens
const UserActions = styled.div`
  margin-left: auto;
`

const Note = ({ note }) => {
  const { loading, error, data } = useQuery(IS_LOGGED_IN)
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error!</p>
  const dateCreated = format(note.createdAt, 'MMM Do YYYY')
  const dateUpdated = format(note.updatedAt, 'MMM Do YYYY')
  let dateString = `${dateCreated}`
  if (dateCreated != dateUpdated && note.updatedAt != undefined) {
    dateString += `, edited on ${dateUpdated}`
  }
  return (
    <StyledNote>
      <MetaData>
        <MetaInfo>
          <img
            src={note.author.avatar}
            alt="{note.author.username} avatar"
            height="50px"
          />
        </MetaInfo>
        <MetaInfo>
          <em>by</em> {note.author.username} <br />
          {dateString}
        </MetaInfo>

        {data.isLoggedIn ? (
          <UserActions>
            <NoteUser note={note} />
          </UserActions>
        ) : (
          <UserActions>
            <em>Favorites:</em> {note.favoriteCount}
          </UserActions>
        )}
      </MetaData>
      <ReactMarkdown source={note.content} />
    </StyledNote>
  )
}

export default Note
