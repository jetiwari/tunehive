import React, { FC, useState } from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import { useTable } from 'react-table';
import logoImage from "./assets/tune-logo.jpg";

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  releaseYear: string;
  lyrics: string;
  duration: string;
  trackNumber: string;
  tags: string;
}

const App: FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [newSong, setNewSong] = useState<Song>({
    id: 0,
    title: "",
    artist: "",
    album: "",
    releaseYear: "",
    lyrics: "",
    duration: "",
    trackNumber: "",
    tags: "",
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentSongId, setCurrentSongId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognition: any | undefined = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSong({ ...newSong, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSong({ ...newSong, [e.target.name]: e.target.files ? e.target.files[0] : null });
  };

  const addOrEditSong = (): void => {
    if (!newSong.title || !newSong.artist) return;
    if (isEditing) {
      setSongs(
        songs.map((song) =>
          song.id === currentSongId ? { ...newSong, id: currentSongId as number } : song
        )
      );
      setIsEditing(false);
    } else {
      setSongs([...songs, { ...newSong, id: songs.length + 1 }]);
    }
    setNewSong({
      id: 0,
      title: "",
      artist: "",
      album: "",
      releaseYear: "",
      lyrics: "",
      duration: "",
      trackNumber: "",
      tags: "",
    });
  };

  const editSong = (song: Song): void => {
    setNewSong(song);
    setIsEditing(true);
    setCurrentSongId(song.id);
  };

  const deleteSong = (id: number): void => {
    setSongs(songs.filter((song) => song.id !== id));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const startVoiceSearch = (): void => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    setIsListening(true);
    recognition.start();
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript.toLowerCase());
      setIsListening(false);
    };
    recognition.onspeechend = () => {
      recognition.stop();
      setIsListening(false);
    };
    recognition.onerror = (event: SpeechRecognitionError) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };
  };

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery) ||
      song.artist.toLowerCase().includes(searchQuery) ||
      song.album.toLowerCase().includes(searchQuery) ||
      song.lyrics.toLowerCase().includes(searchQuery) ||
      song.releaseYear.toLowerCase().includes(searchQuery)
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Artist",
        accessor: "artist",
      },
      {
        Header: "Album",
        accessor: "album",
      },
      {
        Header: "Release Year",
        accessor: "releaseYear",
      },
      {
        Header: "Lyrics",
        accessor: "lyrics",
      },
      {
        Header: "Duration",
        accessor: "duration",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: filteredSongs });

  return (
    <div className="container mt-4">
      <div style={{border:"1px solid #ccc", marginLeft:"25%", marginRight:"20%", paddingBottom:"40px"}}>
      <div className='header'>
      <img src={logoImage} alt="Image" height={90} style={{borderRadius:"50px"}} />
      <h2>Tune Hive</h2>
      </div>
      <Form className="mb-4">
        <Form.Group>
          <Form.Label className="label">Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={newSong.title}
            onChange={handleChange}
            placeholder="Song Title"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label className="label">Artist</Form.Label>
          <Form.Control
            type="text"
            name="artist"
            value={newSong.artist}
            onChange={handleChange}
            placeholder="Artist Name"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label className="label">Album</Form.Label>
          <Form.Control
            type="text"
            name="album"
            value={newSong.album}
            onChange={handleChange}
            placeholder="Album"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label className="label">Release Year</Form.Label>
          <Form.Control
            type="text"
            name="releaseYear"
            value={newSong.releaseYear}
            onChange={handleChange}
            placeholder="Release Year"
          />
        </Form.Group>
      
        <Form.Group>
          <Form.Label className="label">Duration</Form.Label>
          <Form.Control
            type="text"
            name="duration"
            value={newSong.duration}
            onChange={handleChange}
            placeholder="Duration (e.g., 3:45)"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label className="label">Track Number</Form.Label>
          <Form.Control
            type="text"
            name="trackNumber"
            value={newSong.trackNumber}
            onChange={handleChange}
            placeholder="Track Number"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label className="label" style={{marginRight:"10px",position:"relative"}}>Lyrics</Form.Label>
          <Form.Control
            as="textarea" rows={5} cols={82}
            name="lyrics"
            value={newSong.lyrics}
            onChange={handleChange}
            placeholder="lyrics"
            style={{padding: "8px",
              margin: "10px 0",
              width:"60%",
              border: "1px solid #ddd",
              borderRadius: "5px"}}
          />
        </Form.Group>
        <hr/>
        <Button
          variant="primary"
          onClick={addOrEditSong}
          style={{ marginTop: "1px", float: "right" }}
        >
          {isEditing ? "Save Changes" : "Add Song"}
        </Button>
      </Form>
      </div>
      <Form className="mb-4">
        <Form.Group>
          <Form.Label>Search Songs</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by title, artist, album, lyrics, or year"
            value={searchQuery}
            onChange={handleSearch}
          />
          {/* <Button
          onClick={startVoiceSearch}
          disabled={isListening}
          style={{ marginTop: "1px" }}
        >
          {isListening ? "Listening..." : "Voice Search"}
        </Button> */}
        </Form.Group>
        
      </Form>
      <div style={{ margin: "10px" }}>
        <Table style={{width:"100%"}} {...getTableProps()} striped bordered hover>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => editSong(row.original)}
                      className="mr-2"
                      style={{ marginRight: "10px", width:"4rem" }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteSong(row.original.id)}
                      style={{ marginRight: "5px", width:"4rem" }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

    </div>
  );
};

export default App;