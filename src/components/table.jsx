import React, { useEffect, useState, useRef } from "react";
import { IoFilter } from "react-icons/io5";
import { RiResetRightLine } from "react-icons/ri";
import { motion } from 'framer-motion';
import { Search, CircleX } from "lucide-react";

const Student = [
    { name: "John Doe", university_roll_no: "12345678", age: 21, city: "New York", branch: "Computer Science" },
    { name: "Jane Smith", university_roll_no: "87654321", age: 22, city: "Los Angeles", branch: "Mechanical Engineering" },
    { name: "Michael Johnson", university_roll_no: "11223344", age: 23, city: "Chicago", branch: "Electrical Engineering" },
    { name: "Emily Davis", university_roll_no: "22334455", age: 20, city: "Houston", branch: "Civil Engineering" },
    { name: "Daniel Brown", university_roll_no: "33445566", age: 24, city: "Phoenix", branch: "Bio-Technology" },
    { name: "Sophia Wilson", university_roll_no: "44556677", age: 21, city: "Philadelphia", branch: "Chemical Engineering" },
    { name: "James Martinez", university_roll_no: "55667788", age: 22, city: "San Antonio", branch: "Information Technology" },
    { name: "Olivia Taylor", university_roll_no: "66778899", age: 23, city: "San Diego", branch: "Aerospace Engineering" },
    { name: "William Anderson", university_roll_no: "77889900", age: 20, city: "Dallas", branch: "Automobile Engineering" },
    { name: "Ava Thomas", university_roll_no: "88990011", age: 24, city: "San Francisco", branch: "Robotics" },
];

const branches = [
    "Computer Science", "Mechanical Engineering", "Electrical Engineering", "Civil Engineering",
    "Bio-Technology", "Chemical Engineering", "Information Technology", "Aerospace Engineering",
    "Automobile Engineering", "Robotics"
];

const Table = () => {
    const [data, setData] = useState(Student);
    const [isExpanded, setIsExpanded] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "none" });
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState({ age: [0, 100], branch: [], city: [], minAge: 0, maxAge: 100 });
    const [searchKeywords, setSearchKeywords] = useState([]);
    const [removedKeywords, setRemovedKeywords] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentTag, setCurrentTag] = useState("");
    const [moveLeft, setMoveLeft] = useState(false);
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false)
    const [box1, setBox1] = useState(false);
    const [box2, setBox2] = useState(false);
    const [box3, setBox3] = useState(false);
    const filterRef = useRef(null);

    const toggleBox = (box) => {
        if (box === "box1") {
            setBox1(!box1);
            setBox2(false);
            setBox3(false);
        } else if (box === "box2") {
            setBox1(false);
            setBox2(!box2);
            setBox3(false);
        } else if (box === "box3") {
            setBox1(false);
            setBox2(false);
            setBox3(!box3);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setCurrentTag(value);
    };

    const handleSearchSubmit = (e) => {
        if (e.key === "Enter" && currentTag.trim() !== "") {
            setSearchKeywords((prevKeywords) => {
                if (!prevKeywords.includes(currentTag.trim())) {
                    return [...prevKeywords, currentTag.trim()];
                }
                return prevKeywords;
            });
            setSearchTerm("");
            setCurrentTag("");
        }
    };

    const handleTagClick = (keyword) => {
        setSearchKeywords((prevKeywords) => prevKeywords.filter((kw) => kw !== keyword));
    };

    const handleBackspace = (e) => {
        if (e.key === "Backspace" && !searchTerm) {
            if (removedKeywords.length > 0) {
                setSearchKeywords((prevKeywords) => [...prevKeywords, ...removedKeywords]);
                setSearchTerm(""); 
                setRemovedKeywords([]); 
            }
        }
    };

    const handleClearSearch = () => {
        setRemovedKeywords([...searchKeywords]);
        setSearchKeywords([]);  
        setSearchTerm("");
        setCurrentTag("");
        setIsExpanded(false);
        setData(applyFilters(Student) || []);
    };

    useEffect(() => {
        let filteredData = Student;
        searchKeywords.forEach((keyword) => {
            filteredData = filteredData.filter((student) => {
                return (
                    student.name.toLowerCase().includes(keyword.toLowerCase()) ||
                    student.city.toLowerCase().includes(keyword.toLowerCase()) ||
                    student.branch.toLowerCase().includes(keyword.toLowerCase())
                );
            });
        });

        setData(filteredData);
    }, [searchKeywords]);

    useEffect(() => {
        applyFilters();
    }, [filters]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setBox1(false);
                setBox2(false);
                setBox3(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key) {
            if (sortConfig.direction === "asc") direction = "desc";
            else if (sortConfig.direction === "desc") direction = "none";
        }
        setSortConfig({ key, direction });
        if (direction === "none") {
            setData(Student);
        } else {
            const sortedData = [...data].sort((a, b) => {
                if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
                if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
                return 0;
            });
            setData(sortedData);
        }
    };

    const handleFilterChange = (type, value) => {
        setFilters((prevFilters) => {
            if (type === "city" || type === "branch") {
                const newValues = prevFilters[type].includes(value)
                    ? prevFilters[type].filter((c) => c !== value)
                    : [...prevFilters[type], value];
                return { ...prevFilters, [type]: newValues };
            }
            return { ...prevFilters, [type]: value };
        });
    };

    const clearFilters = () => {
        setFilters({ age: [0, 100], branch: [], city: [], minAge: 0, maxAge: 100 });
    };

    const applyFilters = () => {
        let filteredData = Student;
        searchKeywords.forEach((keyword) => {
            filteredData = filteredData.filter((student) => {
                return (
                    student.name.toLowerCase().includes(keyword.toLowerCase()) ||
                    student.city.toLowerCase().includes(keyword.toLowerCase()) ||
                    student.branch.toLowerCase().includes(keyword.toLowerCase())
                );
            });
        });

        const [minAge, maxAge] = filters.age;
        filteredData = filteredData.filter((student) => {
            return (
                (minAge === 0 && maxAge === 100
                    ? true
                    : student.age >= minAge && student.age <= maxAge) &&
                (filters.branch.length ? filters.branch.includes(student.branch) : true) &&
                (filters.city.length ? filters.city.includes(student.city) : true)
            );
        });

        setData(filteredData);
    };

    const handleAgeChange = (value, type) => {
        let updatedAge = [...filters.age];
        if (type === "min") {
            updatedAge[0] = Math.min(value, updatedAge[1]); 
        } else {
            updatedAge[1] = Math.max(value, updatedAge[0]); 
        }
        setFilters({ ...filters, age: updatedAge });
    };

    const handleClick = () => {
        setMoveLeft(!moveLeft);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShow2(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="bg-white min-h-[580px] rounded-lg  p-2 min-w-screen ">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <h1 className="text-xl md:text-2xl mb-2 md:mb-0 font-bold">Student <span className="text-blue-600">Table</span></h1>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center rounded-lg mt-2 ">
                <div className="flex items-center justify-between">
                    <div className="flex relative justify-start">
                        <motion.div
                            initial={{ width: "40px" }}
                            animate={{ width: isExpanded ? "400px" : "40px" }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className={`flex items-center p-2 my-3 mr-3 bg-white border rounded-full overflow-hidden max-w-[260px] md:max-w-[270px] lg:max-w-[500px] ${isExpanded ? "border-blue-500" : "border-gray-300"}`}
                        >
                            <button className="text-blue-600" onClick={() => setIsExpanded(!isExpanded)}>
                                {isExpanded ? <CircleX className="w-5 h-5" onClick={handleClearSearch} /> : <Search className="w-5 h-5" />}
                            </button>
                            {isExpanded && (
                                <>
                                    {searchKeywords.length > 0 && (
                                        <div className="relative flex gap-1 ml-1 overflow-x-auto scrollbar-none leading-[0px]">
                                            {searchKeywords.map((keyword, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-blue-500 text-white text-sm cursor-pointer rounded px-2 md:px-3 py-1"
                                                    onClick={() => handleTagClick(keyword)}
                                                >
                                                    {keyword}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        onKeyDown={(e) => {
                                            handleSearchSubmit(e);
                                            handleBackspace(e);
                                        }}
                                        placeholder="Search"
                                        className="mx-2 outline-none max-w-[100px] md:max-w-[100px] bg-transparent leading-[0px]"
                                    />
                                </>
                            )}
                        </motion.div>
                    </div>
                    <div className="md:hidden relative flex items-center justify-end lg:hidden">
                        <button
                            onClick={() => setShow2(!show2)}
                            className="border-[1px] p-1 md:p-2 rounded hover:border-blue-600"
                        >
                            <IoFilter />
                        </button>
                    </div>
                </div>
                <div className="flex justify-between">
                    <div></div>
                    <div className="flex gap-0">
                        <div className="relative flex items-center md:mr-5">
                            <div className={`hidden lg:flex justify-between absolute md:[170px] lg:w-[390px] h-[60px] right-[10px] bg-white z-10 transition-transform duration-700 ${moveLeft ? 'transform -translate-x-[385px]' : ''}`} >
                                <div></div>
                                <div
                                    className={`flex justify-end p-1 px-3 md:px-3 lg:px-10 m-3 mr-0 bg-white border-[1px] rounded-lg cursor-pointer z-[4] ${isOpen ? 'border-blue-500' : ''}`}
                                    onClick={() => { handleClick(); setIsOpen(!isOpen); setShow(!show); }}
                                >
                                    <button className="flex items-center p-1">
                                        <IoFilter />
                                        <span className="pl-1">Filters</span>
                                        <span className="pl-1">{isOpen ? "→" : ""}</span>
                                    </button>
                                </div>
                            </div>
                            {!isOpen && (filters.city.length > 0 || filters.branch.length > 0 || filters.age[0] !== 0 || filters.age[1] !== 100) && (
                                <div className="hidden lg:block absolute w-[12px] h-[12px] rounded-full top-[-23px] right-[5px] bg-blue-600 z-10">
                                    <div className="absolute w-[12px] h-[12px] rounded-full bg-blue-600 animate-ping"></div>
                                </div>
                            )}
                            {show && (
                                <div className="flex gap-3 z-1  md:ml-0">
                                    <div className=" relative right-[10px]  rounded-md  ">
                                        <div ref={filterRef} className="flex  ">
                                            <div className="flex  ">
                                                <div className="flex flex-wrap ">
                                                    <button
                                                        className="text-sm min-w-[85px] font-medium border rounded bg-blue1 text-blue-600 px-4 border-blue1"
                                                        onClick={() => { setBox1(!box1); toggleBox("box1"); }}
                                                    >
                                                        City {filters.city.length > 0 && `(${filters.city.length})`}
                                                    </button>
                                                </div>

                                                {box1 && (
                                                    <div className="absolute top-[28px] bg-white grid grid-cols-2 md:grid-cols-3 gap-2 p-2 max-w-[500px] border-2 mt-2 text-sm ">
                                                        {["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Francisco"].map((city) => (
                                                            <button
                                                                key={city}
                                                                className={`p-1 border rounded ${filters.city.includes(city) ? 'bg-blue1 text-blue-600' : ''}`}
                                                                onClick={() => handleFilterChange("city", city)}
                                                            >
                                                                {city}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="flex flex-wrap gap-2  px-3">
                                                    <button
                                                        className="text-sm font-medium min-w-[96px] border px-3 p-1 rounded bg-blue1 text-blue-600 border-blue1"
                                                        onClick={() => { setBox2(!box2); toggleBox("box2"); }}
                                                    >
                                                        Branch {filters.branch.length > 0 && `(${filters.branch.length})`}
                                                    </button>
                                                </div>

                                                {box2 && (
                                                    <div className="absolute top-[28px] bg-white grid grid-cols-2 md:grid-cols-3 gap-2 p-2  border-2 mt-2 text-sm">
                                                        {branches.map((branch) => (
                                                            <button
                                                                key={branch}
                                                                className={`p-1 border rounded ${filters.branch.includes(branch) ? 'bg-blue1 text-blue-600' : ''}`}
                                                                onClick={() => handleFilterChange("branch", branch)}
                                                            >
                                                                {branch}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="">
                                                    <button className="text-sm border min-w-[164px] rounded bg-blue1 text-blue-600  border-blue1 font-medium px-3 p-1" onClick={() => toggleBox("box3")}>
                                                        Age Range ({filters.age[0]} - {filters.age[1]})
                                                    </button>
                                                </div>
                                                {box3 && (
                                                    <div className="absolute md:left-[175px] top-[38px] bg-white px-3 p-1 border">
                                                        <label className="text-xs">Min. Age:</label>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="100"
                                                            value={filters.age[0]}
                                                            onChange={(e) => handleAgeChange(Number(e.target.value), "min")}
                                                            className="w-full"
                                                        />
                                                        <label className="text-xs">Max. Age:</label>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="100"
                                                            value={filters.age[1]}
                                                            onChange={(e) => handleAgeChange(Number(e.target.value), "max")}
                                                            className="w-full"
                                                        />
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-xs">Min. Age: {filters.age[0]}</span>
                                                            <span className="text-xs">Max. Age: {filters.age[1]}</span>
                                                        </div>
                                                    </div>
                                                )}

                                            </div>

                                        </div>
                                    </div>

                                </div>
                            )}
                            {show2 && (
                                <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
                                    <div ref={filterRef} className="bg-white p-6 border rounded-md shadow-lg w-[90%] max-w-lg">
                                        <div className="flex flex-col gap-3">
                                            <button
                                                className="text-sm font-medium border rounded bg-blue1 text-blue-600 px-4 py-2 border-blue1"
                                                onClick={() => toggleBox("box1")}
                                            >
                                                City {filters.city.length > 0 && `(${filters.city.length})`}
                                            </button>
                                            {box1 && (
                                                <div className="bg-white grid grid-cols-2 gap-2 p-2 border-2 text-sm rounded-md">
                                                    {["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Francisco"].map((city) => (
                                                        <button
                                                            key={city}
                                                            className={`p-1 border rounded ${filters.city.includes(city) ? "bg-blue1 text-blue-600" : ""}`}
                                                            onClick={() => handleFilterChange("city", city)}
                                                        >
                                                            {city}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            <button
                                                className="text-sm font-medium border rounded bg-blue1 text-blue-600 px-4 py-2 border-blue1"
                                                onClick={() => toggleBox("box2")}
                                            >
                                                Branch {filters.branch.length > 0 && `(${filters.branch.length})`}
                                            </button>
                                            {box2 && (
                                                <div className="bg-white grid grid-cols-2 gap-2 p-2 border-2 text-sm rounded-md">
                                                    {branches.map((branch) => (
                                                        <button
                                                            key={branch}
                                                            className={`p-1 border rounded ${filters.branch.includes(branch) ? "bg-blue1 text-blue-600" : ""}`}
                                                            onClick={() => handleFilterChange("branch", branch)}
                                                        >
                                                            {branch}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            <button className="text-sm font-medium border rounded bg-blue1 text-blue-600 px-4 py-2 border-blue1" onClick={() => toggleBox("box3")}>
                                                Age Range ({filters.age[0]} - {filters.age[1]})
                                            </button>
                                            {box3 && (
                                                <div className="bg-white px-3 p-1 border ">
                                                    <label className="text-xs">Min. Age:</label>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        value={filters.age[0]}
                                                        onChange={(e) => handleAgeChange(Number(e.target.value), "min")}
                                                        className="w-full"
                                                    />
                                                    <label className="text-xs">Max. Age:</label>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        value={filters.age[1]}
                                                        onChange={(e) => handleAgeChange(Number(e.target.value), "max")}
                                                        className="w-full"
                                                    />
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-xs">Min. Age: {filters.age[0]}</span>
                                                        <span className="text-xs">Max. Age: {filters.age[1]}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-4 flex justify-between">
                                            <div>
                                                {(filters.age[0] !== 0 || filters.age[1] !== 100 || filters.city.length > 0 || filters.branch.length > 0) && (
                                                    <div className=" ">
                                                        <button className="p-2 px-6 border-2 border-red-500 rounded bg-red-500 text-white" onClick={clearFilters}>Reset</button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="">
                                                <button className="p-2 px-6 border-2 rounded" onClick={() => setShow2(!show2)}>Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {(filters.age[0] !== 0 || filters.age[1] !== 100 || filters.city.length > 0 || filters.branch.length > 0) && (
                                <div className="flex items-center">
                                    <button className={`hidden md:flex p-1 md:p-[6px] absolute top-[-6px]  md:top-[3px] ${isOpen ? 'lg:top-[1px]' : 'lg:top-[-15px]'}  md:right-[-60px] lg:right-[-25px] bg-red-500 text-white rounded`} onClick={clearFilters}>
                                        <RiResetRightLine />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="hidden relative top-[20px] md:top-[-1px] md:right-[25px] md:flex items-center justify-end lg:hidden">
                            <button onClick={() => setShow(!show)} className="border-[1px] p-1 md:p-2 rounded hover:border-blue-600">
                                <IoFilter />
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            <div className="overflow-x-auto rounded-lg my-3 mt-2 md:mt-0">
                <table className="min-w-[340%] md:min-w-[100%] lg:min-w-full bg-white">
                    <thead className=" text-white">
                        <tr>
                            <div className="grid grid-cols-5 bg-blue-600 rounded-xl py-2">
                                {["name", "university_roll_no", "age", "city", "branch"].map((col) => (
                                    <div>
                                        <th
                                            key={col}
                                            className="px-4 py-1 text-sm font-semibold lg:text-base cursor-pointer"
                                            onClick={() => handleSort(col)}
                                        >
                                            {col.charAt(0).toUpperCase() + col.slice(1)}
                                            {sortConfig.key === col && (
                                                <span className="ml-2 md:absolute">
                                                    {sortConfig.direction === "asc" ? "🔼" : sortConfig.direction === "desc" ? "🔽" : ""}
                                                </span>
                                            )}
                                        </th>
                                    </div>
                                ))}
                            </div>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((student, index) => (
                                <tr key={index} className="text-left rounded-lg">
                                    <div className="grid grid-cols-5 gap-2 border-[1px] rounded-lg my-3 w-[100%]">
                                        <div><td className="px-4 py-2">{student.name}</td></div>
                                        <div><td className="px-4 py-2">{student.university_roll_no}</td></div>
                                        <div><td className="px-4 py-2">{student.age}</td></div>
                                        <div><td className="px-4 py-2">{student.city}</td></div>
                                        <div><td className="px-4 py-2">{student.branch}</td></div>
                                    </div>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4">No Data Found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;
