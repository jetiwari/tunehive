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
  genre: string;
  duration: string;
  lyrics: string;
  trackNumber: string;
  audioFile: File | null;
  coverImage: File | null;
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
    genre: "",
    duration: "",
    lyrics: "",
    trackNumber: "",
    audioFile: null,
    coverImage: null,
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
      genre: "",
      duration: "",
      lyrics: "",
      trackNumber: "",
      audioFile: null,
      coverImage: null,
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
      song.genre.toLowerCase().includes(searchQuery) ||
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
        Header: "Genre",
        accessor: "genre",
      },
      {
        Header: "Duration",
        accessor: "duration",
      },
      {
        Header: "Track Number",
        accessor: "trackNumber",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: filteredSongs });

  return (
    <div className="container mt-4">
      <img src={logoImage} alt="Image" height={90} style={{borderRadius:"50px"}} />
      <h2>Tune Hive</h2>

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
          <Form.Label className="label">Genre</Form.Label>
          <Form.Control
            type="text"
            name="genre"
            value={newSong.genre}
            onChange={handleChange}
            placeholder="Genre"
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
          <Form.Label className="label">Audio File</Form.Label>
          <Form.Control
            type="file"
            name="audioFile"
            onChange={handleFileChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label className="label">Cover Image</Form.Label>
          <Form.Control
            type="file"
            name="coverImage"
            onChange={handleFileChange}
          />
        </Form.Group>

        <Button
          variant="primary"
          onClick={addOrEditSong}
          style={{ marginTop: "15px", float: "right" }}
        >
          {isEditing ? "Save Changes" : "Add Song"}
        </Button>
      </Form>

      <Form className="mb-4">
        <Form.Group>
          <Form.Label>Search Songs</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by title, artist, album, genre, or year"
            value={searchQuery}
            onChange={handleSearch}
          />
        </Form.Group>
        <Button
          onClick={startVoiceSearch}
          disabled={isListening}
          style={{ float: "right", marginTop: "15px" }}
        >
          {isListening ? "Listening..." : "Voice Search"}
        </Button>
      </Form>

      <div style={{ marginTop: "100px" }}>
        <Table {...getTableProps()} striped bordered hover>
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
                      style={{ marginRight: "10px" }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteSong(row.original.id)}
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