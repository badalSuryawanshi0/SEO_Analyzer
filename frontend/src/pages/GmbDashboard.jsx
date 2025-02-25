import { useState, useEffect, useContext } from "react";
import { Input } from "@/components/ui/input";
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search as SearchIcon, MapPinCheckInside, CircleAlert, Loader2, LucideSortAsc, LucideSortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { AuthContext } from "@/components/AuthProvider";
import { toast } from "sonner";

// Utility function to truncate text
const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const GmbSearch = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([
    {
      "name": "Dr. Rajesh Ganesh Parthsarthi- General Physician in Delhi",
      "profileLink": "https://www.google.com/maps/place/Dr.+Rajesh+Ganesh+Parthsarthi-+General+Physician+in+Delhi/data=!4m7!3m6!1s0x390ce37e949d6553:0x7cd1a16dffc4cfa9!8m2!3d28.5380388!4d77.2641793!16s%2Fg%2F11spx78b6m!19sChIJU2WdlH7jDDkRqc_E_22h0Xw?authuser=0&hl=en&rclk=1",
      "type": "Specialized clinic",
      "address": "24*7 Janaki Healthsquare 53A/1, Govindpuri, University, near Acharya Narendra Dev College, Kalkaji, New Delhi, Delhi 110019",
      "rating": 4.2,
      "reviewCount": 31,
      "directionEnabel": true,
      "websiteLink": "https://remedoapp.com/rweb/doctors/drrajeshganeshparthsarthi?param=booking&utm_source=gmb&utm_medium=appt&utm_campaign=tu",
      "bookOnlineLink": "N/A",
      "callNumber": "N/A",
      "openHours": "Open 24 hours",
      "bookingProcess": {
          "thirdParty": true,
          "link": "https://remedoapp.com/rweb/doctors/drrajeshganeshparthsarthi?param=booking&utm_source=gmb&utm_medium=appt&utm_campaign=tu"
      },
      "score": 75
  }
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isSortedByRating, setIsSortedByRating] = useState(false); // New state for sorting
  const  [isSortedByScore, setIsSortedByScore] = useState(false); // New state for sorting
  const { isLoading, setIsLoading } = useContext(AuthContext);
  const[isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(false);
  const [noteInput, setNoteInput] = useState(false)


  const fetchData = async () => {
    setIsLoading(true);
    const toastId = toast.loading('Searching for doctors...');
    try {
      console.log("log before going to server", { search });
      const response = await axios.post("/api/analyze/gmb", { search });
      console.log("Logging the response", response.data.doctorsData);
      setData(response.data.doctorsData);
      toast.success('Search completed successfully!', {
        id: toastId,
      });
    } catch (error) {
      console.error("Error while fetching data", error);
      toast.error('Failed to fetch doctor data. Please try again.', {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let results = data.filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    if (isSortedByRating) {
      results = results.sort((a, b) => a.rating - b.rating);
    }
    if (isSortedByScore) {
      results = results.sort((a, b) => a.score - b.score);
    }
    setFilteredData(results);
  }, [searchTerm, data, isSortedByRating, isSortedByScore]);

  const getCsvFilename = () => {
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10);
    return `doctors_data_${formattedDate}}.csv`;
  };

  return (
    
    <div className="min-h-screen bg-[#fafafa] p-8 animate-fade-in">
      <div className="flex justify-start mb-4">
        <Link to='/'>
          <Button variant='link' className="text-gray-500 hover:text-gray-700">Home</Button>
        </Link>
      </div>
         
      <div className="w-full mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-light tracking-tight">Search Doctors</h1>
          <p className="text-muted-foreground">
            Find the best doctors in your area
          </p>
        </div>

        <div className="relative w-full sm:max-w-md mx-auto"> {/*Search*/}
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="search"
            placeholder="Search by name, type, address..."
            className="w-full pl-10 h-12 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && search.trim()) {
                fetchData();
              }
            }}
          />
        </div>
        {isLoading ? (
          <Button disabled>
            <Loader2 className="animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button onClick={fetchData}>Search</Button>
        )}
        {data.length > 0 ? (
          <div className="relative flex w-full sm:w-1/5"> {/*Filter Search*/}
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="search"
              placeholder="Search by name, type ..."
              className="w-full pl-10 h-12 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        ) : ("")}
        {data.length > 0 && (
          <div className="flex justify-end mb-4">
            <CSVLink data={prepareCsvData(data)} filename={getCsvFilename()} className="btn btn-primary">
              <Button variant='link'>
                Download CSV
              </Button>
            </CSVLink>
          </div>
        )}
        {data.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Profile Link</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-center">
                    Rating
                    <button onClick={() => setIsSortedByRating(!isSortedByRating)} className="ml-2">
                      {isSortedByRating ? (
                        <LucideSortDesc className="h-4 w-4 inline-block" />
                      ) : (
                        <LucideSortAsc className="h-4 w-4 inline-block" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead className="text-center">Reviews</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead className="text-center">Booking Link</TableHead>
                  <TableHead className="text-center">Website</TableHead>
                  <TableHead className="text-center">On-site BookingProcess</TableHead>
                  <TableHead className="text-center">Direction Enable</TableHead>
                  <TableHead className="text-center">Score
                    <button onClick={()=> setIsSortedByScore(!isSortedByScore)}>
                      {isSortedByScore ?(
                        <LucideSortAsc className="h-4 w-4 inline-block"/>
                      ):(
                        <LucideSortDesc className="h-4 w-4 inline-block" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead className= "text-center">Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      <p className="text-muted-foreground">No doctors found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((doctor, index) => (
                    <TableRow
                      key={index}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <TableCell className="font-medium max-w-xs truncate">
                        {doctor.name}
                      </TableCell>
                      <TableCell>{doctor.type}</TableCell>
                      <TableCell>{<a href={doctor.profileLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                      >
                        {truncateText(doctor.profileLink, 20)}
                        </a>}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {doctor.address}
                      </TableCell>
                      <TableCell className="text-center">
                        {doctor.rating} 
                      </TableCell>
                      <TableCell className="text-center">
                        {doctor.reviewCount}
                      </TableCell>
                      <TableCell>
                        {doctor.callNumber !== "N/A" ? (
                          <a
                            href={`tel:${doctor.callNumber}`}
                            className="text-blue-600 hover:underline"
                          >
                            {doctor.callNumber}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>{doctor.openHours}</TableCell>
                      <TableCell className="text-center">
                        <a
                          href={doctor.bookOnlineLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {truncateText(doctor.bookOnlineLink, 20)}
                        </a>
                      </TableCell>
                      <TableCell className="text-center">
                        {doctor.websiteLink ? (
                          <a
                            href={doctor.websiteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {truncateText(doctor.websiteLink, 20)}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        {doctor.bookingProcess !== "N/A" ? ( doctor.bookingProcess.thirdParty ? (<a href={doctor.bookingProcess.link} target="_blank" rel="noopener noreferrer" title={doctor.bookingProcess.link} className="text-blue-500 hover:">
                          Third-Party service
                        </a>) : doctor.bookingProcess.hasForm ? "Form available" : doctor.bookingProcess.hasTimeslot ? "Timeslot available" : "UNK"):("N/A")}
                      </TableCell>
                      <TableCell className="text-center">
                        {doctor.directionEnabel !== true ? (
                          <CircleAlert
                            color="red"
                            style={{ padding: "2px", paddingLeft: "4px" }}
                          />
                        ) : (
                          <MapPinCheckInside color="green" />
                        )}
                      </TableCell>
                      <TableCell>
                      <Input 
  className="w-12 h-8" 
    value={doctor.score}
onChange={(e) => {
  const newScore = e.target.value.trim();
  let parsedScore = Number(newScore);

  if (newScore === "") {
    // If the input is empty, set the score to zero
    updateScores(0);
  } else if (!Number.isNaN(parsedScore) && parsedScore >= 1 && parsedScore <= 100) {
    // Ensure the score is within the range of 1-100
    parsedScore = Math.min(Math.max(parsedScore, 1), 100);
    updateScores(parsedScore);
  }

  function updateScores(score) {
    setFilteredData(filteredData.map((item, idx) => 
      idx === index ? { ...item, score } : item
    ));

    setData(data.map((item, idx) => 
      idx === index ? { ...item, score } : item
    ));
  }
}}
/>
                      </TableCell>
                      <TableCell>
                        {isPopupOpen && activeIndex === index ? (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div>
                            <textarea className="w-64 h-32 p-2 border rounded mb-4"
                            value={noteInput}
                            onChange={(e)=> setNoteInput(e.target.value)}
                            
                            placeholder="Enter your note"
                            />
                            
                              {console.log(noteInput)}
                             { console.log(isPopupOpen)}
                             { console.log(activeIndex)}
                             {
                              console.log(JSON.stringify(filteredData[0]))
                             }
                            
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={ ()=> {setActiveIndex(null); setIsPopupOpen(false); setNoteInput("")} } >Cancel</Button>
                              <Button variant ="outline" onClick={()=>
                                {
                                   //Update both state with new note 
                                   setFilteredData(filteredData.map((item,idx)=>
                                  idx === index ? {...item, note:noteInput} : item
                                  ))
                                  setData(data.map((item,idx)=>
                                  idx === index ? {...item, note:noteInput} : item
                                  //Close the popup and reset the state
                                  
                                  ))
                                  setActiveIndex(null);
                                  setIsPopupOpen(false)
                                  setNoteInput("")
                                }
                              }>Save</Button>
                            </div>
                          </div>
                        </div>):(<div className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                        onClick={()=>{
                          setIsPopupOpen(true)
                          setActiveIndex(index)
                          setNoteInput(doctor.note || "")
                        }}>
                          {doctor.note ? truncateText(doctor.note,20):("Add note")}
                        </div>)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="bg-blue-50 p-6 rounded-full mb-6">
              <SearchIcon className="w-16 h-16 text-gray-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">Start Your Search</h3>
            <p className="text-gray-600 text-center max-w-md mb-6 px-4">
              Find detailed information about doctors in your area including ratings, reviews, contact details, and more.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPinCheckInside className="w-5 h-5 text-green-500" />
                <span>View locations and directions</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CircleAlert className="w-5 h-5 text-blue-500" />
                <span>Check ratings and reviews</span>
              </div>
            </div>
            <Button 
              onClick={fetchData} 
              className="mt-8 bg-gray-600 hover:bg-gray-800 text-white px-8 py-2"
              disabled={!search}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                'Start Searching'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GmbSearch;

const prepareCsvData = (data) => {
  return data.map((doctor) => {
    // Extract keys with true values from bookingProcess
    const bookingProcessKeys = Object.keys(doctor.bookingProcess)
      .filter(key => doctor.bookingProcess[key])
      .join(", "); // Join the keys into a string

    return {
      ...doctor,
      bookingProcess: bookingProcessKeys || "N/A", // If no keys are true, set to "N/A"
    };
  });
};