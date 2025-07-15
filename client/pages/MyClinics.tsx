import { useState, useEffect, useContext } from "react";
import { fetchDataFromApi } from "@/lib/api";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { MyContext } from "../App";
const MyClinics = () => {
  const context = useContext(MyContext);
  const { user } = context;
  const [isOpenModal, setisOpenModal] = useState(false);
  const [clinicId, setClinicId] = useState();
  const [selectedTab, setselectedTab] = useState(null);
  const [clinicName, setClinicName] = useState();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [clinicData, setClinicData] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState("");

  useEffect(() => {
    const userDetails = JSON.parse(user);
    console.log("User details:", userDetails);

    axios
      .get(
        `http://20.235.173.36:3001/api/user/get/client?id=${userDetails?.userId}`,
      )
      .then((res) => {
        console.log(`My Clinics ${JSON.stringify(res)}`);
        const clinicsRaw = res.data.response[0].Clinics;
        const address = res.data.response[0].ClinicAddress;

        setData(address);

        const allClinicData = clinicsRaw.map((item) => ({
          id: item._id,
          name: item.clinicname,
        }));
        localStorage.setItem("AssociatedClinic", JSON.stringify(allClinicData));

        let finalClinics = [];

        if (!userDetails?.founder) {
          console.log("if");
          finalClinics = clinicsRaw.filter(
            (clinic: any) => clinic.superAdmin === true,
          );
        } else if (userDetails?.founder) {
          console.log("else if condition");
          finalClinics = clinicsRaw.filter(
            (clinic: any) =>
              userDetails.founder === true &&
              (clinic.isVerified === "Pending" ||
                clinic.isVerified === "approved"),
          );
        }

        const clinics = finalClinics.map((clinic) => ({
          ...clinic,
          clinicname: clinic?.clinicname,
          clinicemail: clinic?.clinicemail,
          clinicphone: clinic?.clinicphone,
        }));

        console.log(`clinics`, clinics);

        const activeClinic = clinics.find(
          (clinic) => clinic._id === userDetails?.clinicId,
        );

        const resolvedClinicName =
          activeClinic?.clinicname || clinics[0]?.clinicname;
        const isVerified = activeClinic?.isVerified || clinics[0]?.isVerified;

        console.log(`clinic name: ${resolvedClinicName}`);
        console.log(`isVerified: ${isVerified}`);

        if (resolvedClinicName) {
          localStorage.setItem("clinicName", resolvedClinicName);
          localStorage.setItem("isVerified", isVerified);
        }

        setClinicName(resolvedClinicName);
        setClinicData(clinics);
        setFilteredData(clinicsRaw);
      })
      .catch((error) => {
        console.error("Error fetching clinic data:", error);
      });
  }, [isOpenModal]);

  const handleClinicSelection = async (clinic, index) => {
    setselectedTab(index);
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      user.clinicId = clinic._id;

      if (
        clinic.parentclinicid === "" ||
        clinic.parentclinicid === clinic._id
      ) {
        user.isAdmin = true;
      } else {
        user.isAdmin = false;
      }

      localStorage.setItem("user", JSON.stringify(user));
      const existingUser = JSON.parse(localStorage.getItem("existingUser"));

      if (existingUser) {
        const clinicIndex = existingUser.clinicid.indexOf(clinic._id);

        if (clinicIndex !== -1) {
          const relatedPermission = existingUser.permission[clinicIndex];

          localStorage.setItem("selectedClinic", clinic._id);
          localStorage.setItem("userPermission", relatedPermission);

          setSelectedClinic(clinic._id);
          // setUserPermission(relatedPermission);
        }
      }

      setClinicId(clinic._id);
    }
    localStorage.setItem("clinicName", clinic?.clinicname);
    setClinicName(clinic.clinicname);
    setisOpenModal(false);

    await new Promise((resolve) => setTimeout(resolve, 100));
    window.location.reload();
  };

  return (
    <>
      {filteredData.map((clinic, index) => (
        <DropdownMenuItem
          key={index}
          className="flex items-start gap-3 px-4 py-3 hover:bg-secondary-yellow40 cursor-pointer"
          onClick={() => handleClinicSelection(clinic, index)}
        >
          <User className="w-4 h-4 text-primary-dark-blue mt-1" />
          <div className="flex flex-col">
            <span className="font-gabarito font-bold text-primary-dark-blue">
              {clinic.clinicname}
            </span>
            {/* <span className="text-xs text-neutral-60">{clinic.location}</span> */}
          </div>
        </DropdownMenuItem>
      ))}
    </>
  );
};

export default MyClinics;
