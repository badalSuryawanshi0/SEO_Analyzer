import { useState, useEffect, useContext } from "react";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search as SearchIcon , MapPinCheckInside, CircleAlert, Loader2} from "lucide-react";
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
  const [data, setData] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState("");
  const {isLoading, setIsLoading} = useContext(AuthContext)

    

  const fetchData = async()=>
  {
   const apiCall = async()=>
   {
    try {
      console.log("log before going to server",{search})
      const response = await axios.post("/api/analyze/gmb",{search})
  console.log("Logging the response",response.data.doctorsData)
   setData(response.data.doctorsData)
   setIsLoading(false)
   console.log("Pew Pew")
  } catch (error) {
      console.log("Error while fethcing data", error)
  }
  toast.promise(apiCall, {
    loading:"Loading...",
    success: ()=> "Gmb analysis finished. See results below",
    error: () => "O paaji error aagya ji"
      
  })
   }
  }
  // //Use Effect for filter 
  // useEffect(() => {
  //   const results = data.filter((item) =>
  //     Object.values(item).some((value) =>
  //       value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  //     )
  //   );
  //   setFilteredData(results);
  // }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#fafafa] p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-light tracking-tight">Search Doctors</h1>
          <p className="text-muted-foreground">
            Find the best doctors in your area
          </p>
        </div>

        <div className="relative max-w-xl mx-auto"> {/*Search*/}
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="search"
            placeholder="Search by name, type, address..."
            className="w-full pl-10 h-12 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {isLoading ? (<Button disabled>
         <Loader2 className="animate-spin"/>
         Please wait
        </Button>)
        :
        (<Button onClick={()=>(fetchData() && setIsLoading(true))} >Search</Button>
        )}
         <div className="relative w-1/5">    {/*Filter Search*/}
         <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="search"
            placeholder="Search by name, type ..."
            className="w-full pl-10 h-12 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
         </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-center">Rating</TableHead>
                <TableHead className="text-center">Reviews</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead className="text-center">Booking Link</TableHead>
                <TableHead className="text-center">Website</TableHead>
                <TableHead className="text-center">Direction Enable</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <p className="text-muted-foreground">No doctors found</p>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((doctor, index) => (
                  <TableRow
                    key={index}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <TableCell className="font-medium max-w-xs truncate">
                      {doctor.name}
                    </TableCell>
                    <TableCell>{doctor.type}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {doctor.address}
                    </TableCell>
                    <TableCell className="text-center">
                      {doctor.rating} ⭐️
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
                      {doctor.websiteLink ? (<a
                        href={doctor.websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {truncateText(doctor.websiteLink, 20)}
                      </a>): "N/A"}
                    </TableCell>
                    <TableCell className="text-center" >
                        {doctor.directionEnabel !== true ?
                        (<CircleAlert color="red" style={{padding:"2px", paddingLeft:"4px"}} />):(<MapPinCheckInside color="green"/>) }
                    </TableCell> 
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default GmbSearch;