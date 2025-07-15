import React, { useState, useEffect, useContext } from "react";
import { fetchDataFromApi, postData, uploadImage, deleteImages } from "../lib/api";
import { GetCountries, GetState, GetCity } from "react-country-state-city";
import { useNavigate, useLocation } from "react-router-dom";
import { MyContext } from "../App";



import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail } from "lucide-react";

interface Clinic {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  country: string;
  state: string;
  city: string;
  status: string;
}

interface ClinicManagementFormProps {
  clinics: Clinic[];
  showClinicForm: "edit" | "create" | null;
  selectedClinic: Clinic | null;
  selectedCountry: string;
  selectedState: string;
  selectedCity: string;
  setShowClinicForm: (v: "edit" | "create" | null) => void;
  setSelectedClinic: (v: Clinic | null) => void;
  setSelectedCountry: (v: string) => void;
  setSelectedState: (v: string) => void;
  setSelectedCity: (v: string) => void;
  handleSave: (type: string) => void;
  countryStateCity: Record<string, Record<string, string[]>>;
  speciesOptions: string[];
  practiceTypeOptions: string[];
}

const ClinicManagementForm: React.FC<ClinicManagementFormProps> = ({
  clinics,
  showClinicForm,
  selectedClinic,
  selectedCountry,
  selectedState,
  selectedCity,
  setShowClinicForm,
  setSelectedClinic,
  setSelectedCountry,
  setSelectedState,
  setSelectedCity,
  handleSave,
  countryStateCity,
  speciesOptions,
  practiceTypeOptions,
}) => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  // --- State hooks migrated from legacy ClinicManagement ---
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string | null>(null);
  const [hospitalGroupType, setHospitalGroupType] = useState<any[]>([]);
  const [groupPurchaseType, setGroupPurchaseType] = useState<any[]>([]);
  const [groupPurchase, setGroupPurchase] = useState<any[]>([]);
  const [selectedPracticeTypes, setSelectedPracticeTypes] = useState<any[]>([]);
  const [hospitalGroup, setHospitalGroup] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [clinicData, setClinicData] = useState<any[]>([]);
  const [popUpInvite, setPopUpInvite] = useState(true);
  const [clinicbranch, setClinicbranch] = useState(false);
  const [purchaseGroup, setPurchaseGroup] = useState<any[]>([]);
  const [findAllClinic, setfindAllClinic] = useState<any[]>([]);
  const [existingClinic, setExistingClinic] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<any[]>([]);
  const [selectedspeicestype, setSelectedSpeicesType] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [country, setCountry] = useState<number | null>(null);
  const [currentState, setcurrentState] = useState<number | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [countriesList, setCountriesList] = useState<any[]>([]);
  const [stateList, setStateList] = useState<any[]>([]);
  const [citiesList, setCitiesList] = useState<any[]>([]);
  const [hide, setHide] = useState(false);
  const [formData, setFormData] = useState<any>({
    _id: "",
    speciesid: [],
    parentclinicid: "",
    practiceType: "",
    clinicname: "",
    building: "",
    zipCode: "",
    city: "",
    state: "",
    gpo: "",
    chg: "",
    image: [],
  });

  // --- useEffect hooks for initial and dependent data fetching ---
  useEffect(() => {
    async function fetchCountries() {
      const countries = await GetCountries();
      setCountriesList(countries);
      const india = countries.find((c: any) => c.name === "India");
      if (india) setCountry(india.id); // india.id is a number
    }
    fetchCountries();
  }, []);

  useEffect(() => {
    if (!country) return;
    async function fetchStates() {
      const states = await GetState(country);
      setStateList(states);
    }
    fetchStates();
  }, [country]);

  useEffect(() => {
    if (!country || !currentState) return;
    async function fetchCities() {
      const cities = await GetCity(country, currentState);
      setCitiesList(cities);
    }
    fetchCities();
  }, [country, currentState]);

  useEffect(() => {
    // Placeholder: Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  // --- Handler and API logic migrated from legacy ClinicManagement ---

  // Input change for general clinic fields
  const onchangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClinicData((prevData: any) => ({
      ...prevData,
      findExistingClinic: {
        ...prevData.findExistingClinic,
        [name]: value,
      },
    }));
  };

  // Input change for address fields
  const onChnageInputClinicaddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClinicData((prevData: any) => ({
      ...prevData,
      findClinicAddress: {
        ...prevData.findClinicAddress,
        [name]: value,
      },
    }));
  };

  // Practice type selection
  const handleSelectPracticeType = (id: string) => {
    setSelectedPracticeTypes((prev: string[]) =>
      prev.includes(id) ? prev.filter((typeId) => typeId !== id) : [...prev, id]
    );
  };

  // Species selection
  const handleSelectSpecies = (id: string) => {
    setSelectedSpeicesType((prevSpeciesIds: string[]) => {
      const updatedSpeciesIds = prevSpeciesIds.includes(id)
        ? prevSpeciesIds.filter((speciesId) => speciesId !== id)
        : [...prevSpeciesIds, id];
      setFormData((prevFields: any) => ({
        ...prevFields,
        speciesid: updatedSpeciesIds,
      }));
      return updatedSpeciesIds;
    });
  };

  // GPO/corporate group logic
  const handleforGpo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, chg: e.target.value });
  };

  const handleforgroupPurchase = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = e.target.value;
    setFormData({ ...formData, gpo: selectedValue });
    setGroupPurchaseType([selectedValue]);
  };

  const handleOptionGpo = (option: string) => {
    if (option === "yes") {
      setGroupOpen(true);
    } else if (option === "no") {
      setFormData({ ...formData, gpo: "1" });
      setGroupPurchaseType(["1"]);
      setGroupOpen(false);
    } else if (option === "not-sure") {
      setFormData({ ...formData, gpo: "2" });
      setGroupPurchaseType(["2"]);
      setGroupOpen(false);
    } else {
      setGroupOpen(false);
    }
    setSelectedOption(option);
  };

  const handleChangedGpo = (optiontwo: string) => {
    if (optiontwo === "yes") {
      setIsOpen(true);
    } else if (optiontwo === "no") {
      setFormData({ ...formData, chg: "1" });
      setHospitalGroupType(["1"]);
      setIsOpen(false);
    } else if (optiontwo === "not-sure") {
      setFormData({ ...formData, chg: "2" });
      setHospitalGroupType(["2"]);
      setIsOpen(false);
    } else {
      setIsOpen(false);
    }
    setSelectedOptions(optiontwo);
  };

  
  // Fetch clinic data for editing
  const fetchData = async (id: string) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || '{}');
      const response = await fetchDataFromApi(`/api/clinic/get?id=${id}&userId=${user.userId}`);
      console.log('Fetched clinic API response:', response);
      const {
        findExistingClinic,
        practiceType,
        privateHospitalGroup,
        groupPurchasingOrganisation,
        spieces,
        findAllclinic,
        findClinicAddress,
      } = response;
      console.log('Clinic API extracted:', {
        findExistingClinic,
        practiceType,
        privateHospitalGroup,
        groupPurchasingOrganisation,
        spieces,
        findAllclinic,
        findClinicAddress
      });
      // Species
      const matchedspieces = spieces.filter((item: any) => findExistingClinic.speciesid.includes(item._id));
      const findspiecesid = matchedspieces.map((item: any) => item._id);
      setSelectedSpeicesType(findspiecesid);
      setPreviews(findExistingClinic.image);
      // Practice Type
      const matchedPracticeType = practiceType.filter((item: any) => findExistingClinic.practiceType.includes(item._id));
      if (matchedPracticeType) {
        const findPracticeType = matchedPracticeType.map((item: any) => item._id);
        setSelectedPracticeTypes(findPracticeType);
      }
      // Hospital Group
      const BuyingGroup = findExistingClinic?.chg;
      if (BuyingGroup == 1) {
        setSelectedOptions("no");
        setHospitalGroupType(BuyingGroup);
        setIsOpen(false);
      } else if (BuyingGroup == 2) {
        setSelectedOptions("not-sure");
        setHospitalGroupType(BuyingGroup);
        setIsOpen(false);
      } else {
        const matchedHospitalGroups = privateHospitalGroup.filter((item: any) => findExistingClinic.chg.includes(item._id));
        if (matchedHospitalGroups.length > 0) {
          setIsOpen(true);
          setSelectedOptions("");
          setHospitalGroupType(matchedHospitalGroups[0]._id);
        }
      }
      // GPO
      const hospitalGroup = findExistingClinic?.gpo;
      if (hospitalGroup == 1) {
        setSelectedOption("no");
        setGroupPurchaseType(hospitalGroup);
        setGroupOpen(false);
      } else if (hospitalGroup == 2) {
        setSelectedOption("not-sure");
        setGroupPurchaseType(hospitalGroup);
        setGroupOpen(false);
      } else {
        const matchedGPOs = groupPurchasingOrganisation.filter((item: any) => findExistingClinic.gpo.includes(item._id));
        if (matchedGPOs.length > 0) {
          setGroupOpen(true);
          setSelectedOption("");
          setGroupPurchaseType(matchedGPOs[0]._id);
        }
      }
      if (findAllclinic && findAllclinic.length === 0) {
        setClinicbranch(true);
        setfindAllClinic([findExistingClinic]);
      } else {
        setfindAllClinic(findAllclinic);
      }
      setExistingClinic(findExistingClinic);
      setClinicData(response);
      setHospitalGroup(privateHospitalGroup);
      setPurchaseGroup(groupPurchasingOrganisation);
      setFormData((prev: any) => ({ ...prev, ...findExistingClinic, ...findClinicAddress }));
    } catch (error) {
      console.error("Error fetching clinic data:", error);
    }
  };

  // Clinic card click (for edit)
  const onClinicCardClick = (clinic: any) => {
    setSelectedClinic(clinic);
    fetchData(clinic.id);
    setShowForm(true);
  };

  // Back to clinic list
  const handleBackToClinic = () => {
    setSelectedClinic(null);
    setShowForm(false);
  };

  // Clinic view for approval
  const clinciView = (clinic: any) => {
    setSelectedClinic(clinic);
    fetchData(clinic._id);
    setShowForm(true);
  };

  // Delete clinic
  const deleteClinic = async (id: string) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || '{}');
      const deactiveClinic = { _id: id, active: false, type: "clinic" };
      const res = await postData("/api/user/active/user-clinic", deactiveClinic);
      if (res.msg === "Clinic not found.") {
        context.setAlertBox({ open: true, error: true, msg: res.msg });
        return false;
      }
      if (res.msg === "Clinic deactivated successfully.") {
        context.setAlertBox({ open: true, error: false, msg: res.msg });
        navigate("/home");
        window.location.reload();
      }
    } catch (err) {
      console.log(`err during deactive clinic ${err}`);
    }
  };

  // Form submit handler
  const handleClinicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add validation logic as in legacy code
    if (selectedspeicestype.length === 0) {
      context.setAlertBox({ open: true, error: true, msg: "Please select at least one species." });
      return false;
    }
    if (selectedPracticeTypes.length === 0) {
      context.setAlertBox({ open: true, error: true, msg: "Please select at least one practice type." });
      return false;
    }
    if (!formData.clinicname) {
      context.setAlertBox({ open: true, error: true, msg: "Clinic name is required." });
      return false;
    }
    if (!formData.email) {
      context.setAlertBox({ open: true, error: true, msg: "Clinic email is required." });
      return false;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      context.setAlertBox({ open: true, error: true, msg: "Please enter a valid email address." });
      return false;
    }
    if (!formData.phone) {
      context.setAlertBox({ open: true, error: true, msg: "Clinic phone is required." });
      return false;
    }
    if (!formData.address) {
      context.setAlertBox({ open: true, error: true, msg: "Clinic address is required." });
      return false;
    }
    if (!formData.building) {
      context.setAlertBox({ open: true, error: true, msg: "Clinic building is required." });
      return false;
    }
    if (!formData.zipCode) {
      context.setAlertBox({ open: true, error: true, msg: "Zip code is required." });
      return false;
    }
    if (!city) {
      context.setAlertBox({ open: true, error: true, msg: "City is required." });
      return false;
    }
    if (!currentState) {
      context.setAlertBox({ open: true, error: true, msg: "State is required." });
      return false;
    }
    if (groupPurchaseType.length === 0) {
      context.setAlertBox({ open: true, error: true, msg: "Please select a GPO option." });
      return false;
    }
    if (hospitalGroupType.length === 0) {
      context.setAlertBox({ open: true, error: true, msg: "Please select a hospital group option." });
      return false;
    }
    if (previews.length === 0) {
      context.setAlertBox({ open: true, error: true, msg: "Please upload at least one image." });
      return false;
    }
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const payload = {
      _id: formData._id,
      userid: user.userid,
      clinicname: formData.clinicname,
      clinicaddressid: formData.id,
      clinicphone: formData.phone,
      clinicemail: formData.email,
      streetAddress: formData.address,
      building: formData.building,
      zipCode: formData.zipCode,
      city: city,
      state: currentState,
      practiceType: selectedPracticeTypes,
      gpo: groupPurchaseType,
      chg: hospitalGroupType,
      image: previews,
      speciesid: selectedspeicestype,
    };
    try {
      const response = await postData(`/api/clinic/client/create`, payload);
      if (response) {
        setShowForm(false);
        context.setAlertBox({ open: true, error: false, msg: response.msg });
        await fetchData(formData._id);
      } else {
        context.setAlertBox({ open: true, error: true, msg: response.message });
      }
    } catch (err) {
      context.setAlertBox({ open: true, error: true, msg: "Error submitting form." });
    }
  };

  // File/image upload handler
  const onChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files;
      setUploading(true);
      const uploadFormData = new FormData();
      for (let i = 0; i < files.length; i++) {
        if (
          files[i] &&
          (files[i].type === "image/jpeg" || files[i].type === "image/jpg" || files[i].type === "image/png" || files[i].type === "image/webp")
        ) {
          uploadFormData.append("images", files[i]);
        } else {
          context.setAlertBox({ open: true, error: true, msg: "Invalid image type." });
          setUploading(false);
          return false;
        }
      }
      await uploadImage("/api/clinic/upload", uploadFormData);
      const response = await fetchDataFromApi("/api/imageUpload");
      const newImages = response.flatMap((item: any) => item.images || []).filter((img: any, index: number, arr: any[]) => arr.indexOf(img) === index);
      setPreviews((prevPreviews: string[]) => {
        const updatedPreviews = [...prevPreviews, ...newImages];
        return Array.from(new Set(updatedPreviews));
      });
      setUploading(false);
      context.setAlertBox({ open: true, error: false, msg: "Image uploaded." });
      e.target.value = null;
    } catch (error) {
      setUploading(false);
      context.setAlertBox({ open: true, error: true, msg: "Error uploading image." });
    }
  };

  // Remove image handler
  const removeImg = async (index: number, imgUrl: string) => {
    try {
      await deleteImages(`/api/imageUpload/deleteAllImages?img=${imgUrl}`, {});
      setPreviews((prev) => prev.filter((img, i) => i !== index));
      context.setAlertBox({ open: true, error: false, msg: "Image deleted." });
    } catch (error) {
      context.setAlertBox({ open: true, error: true, msg: "Error deleting image." });
    }
  };

  return (
    <div className="space-y-8">
      {!showClinicForm ? (
        <Card className="bg-white shadow-lg border border-neutral-20 rounded-2xl">
          <CardHeader className="p-6 border-b border-neutral-20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-gabarito font-bold text-primary-dark-blue">
                Clinic Management
              </CardTitle>
              <Button
                onClick={() => {
                  setSelectedClinic(null);
                  setShowClinicForm("create");
                }}
                className="bg-primary-dark-blue hover:bg-primary-dark-blue80 text-white rounded-lg"
              >
                Create New Clinic
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-gabarito font-semibold text-primary-dark-blue">
                All Clinic Branches
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {clinics.map((clinic) => (
                  <Card
                    key={clinic.id}
                    className="border border-neutral-20 hover:border-primary-dark-blue/30 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-gabarito font-semibold text-primary-dark-blue">
                              {clinic.name}
                            </h4>
                            <span className="px-2 py-1 bg-state-green-light text-white text-xs rounded-full">
                              {clinic.status}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm text-neutral-60">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{clinic.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{clinic.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              <span>{clinic.email}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedClinic(clinic);
                              setSelectedCountry(clinic.country);
                              setSelectedState(clinic.state);
                              setSelectedCity(clinic.city);
                              setShowClinicForm("edit");
                            }}
                            className="border-primary-dark-blue text-primary-dark-blue hover:bg-secondary-yellow40 rounded-lg"
                          >
                            Update
                          </Button>
                          <Button
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white shadow-lg border border-neutral-20 rounded-2xl">
          <CardHeader className="p-6 border-b border-neutral-20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-gabarito font-bold text-primary-dark-blue">
                {showClinicForm === "create"
                  ? "Create New Clinic"
                  : "Update Clinic"}
              </CardTitle>
              <Button
                variant="outline"
                onClick={() => setShowClinicForm(null)}
                className="border-neutral-30 text-neutral-60"
              >
                Back to List
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            {/* Species Selection */}
            <div>
              <h3 className="text-lg font-gabarito font-semibold text-primary-dark-blue mb-4">
                SELECT ALL SPECIES TREATED BY YOUR PRACTICE <span className="text-red-500">*</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {speciesOptions.map((species) => (
                  <div
                    key={species}
                    onClick={() => handleSelectSpecies(species)}
                    className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all ${
                      selectedspeicestype.includes(species)
                        ? "border-primary-dark-blue bg-secondary-yellow40"
                        : "border-neutral-30 hover:border-primary-dark-blue/50"
                    }`}
                  >
                    <div className="w-16 h-16 mx-auto mb-2 bg-neutral-10 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📷</span>
                    </div>
                    <span className="font-gabarito font-medium text-primary-dark-blue">
                      {species}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Practice Type */}
            <div>
              <h3 className="text-lg font-gabarito font-semibold text-primary-dark-blue mb-4">
                PRACTICE TYPE(SELECT ALL THAT APPLY) <span className="text-red-500">*</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {practiceTypeOptions.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPracticeTypes.includes(type)}
                      onChange={() => handleSelectPracticeType(type)}
                      className="w-5 h-5 text-primary-dark-blue rounded border-neutral-30 focus:ring-primary-dark-blue/20"
                    />
                    <span className="text-primary-dark-blue font-gabarito font-medium text-sm">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            {/* Clinic Information Form */}
            <div>
              <h3 className="text-lg font-gabarito font-semibold text-primary-dark-blue mb-4">
                CLINIC INFORMATION <span className="text-red-500">*</span>
              </h3>
              <div className="bg-neutral-10 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-primary-dark-blue font-gabarito font-medium">
                      Clinic Name
                    </Label>
                    <Input
                      placeholder="Enter the Clinic Name"
                      name="clinicname"
                      value={formData.clinicname}
                      onChange={onchangeInput}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-primary-dark-blue font-gabarito font-medium">
                      Clinic Email
                    </Label>
                    <Input
                      placeholder="Enter the Clinic Email"
                      name="email"
                      value={formData.email || ''}
                      onChange={onchangeInput}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-primary-dark-blue font-gabarito font-medium">
                      Clinic Phone
                    </Label>
                    <Input
                      placeholder="Enter the Clinic Phone"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={onchangeInput}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-primary-dark-blue font-gabarito font-medium">
                      Clinic Street Address
                    </Label>
                    <Input
                      placeholder="Enter the Clinic Street Address"
                      name="address"
                      value={formData.address || ''}
                      onChange={onChnageInputClinicaddress}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-primary-dark-blue font-gabarito font-medium">
                      Suite/Building, etc.
                    </Label>
                    <Input
                      placeholder="Enter the Suite, Building, etc."
                      name="building"
                      value={formData.building || ''}
                      onChange={onChnageInputClinicaddress}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-primary-dark-blue font-gabarito font-medium">
                      Zip Code
                    </Label>
                    <Input
                      placeholder="Enter the Zip Code"
                      name="zipCode"
                      value={formData.zipCode || ''}
                      onChange={onChnageInputClinicaddress}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-primary-dark-blue font-gabarito font-medium">
                      Select Country
                    </Label>
                    <select
                      value={country || ''}
                      onChange={e => {
                        setCountry(Number(e.target.value));
                        setcurrentState(null);
                        setCity("");
                      }}
                      className="mt-2 w-full border border-neutral-30 rounded-lg px-3 py-2"
                    >
                      <option value="">Select Country</option>
                      {countriesList.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-primary-dark-blue font-gabarito font-medium">
                      Select State
                    </Label>
                    <select
                      value={currentState || ''}
                      onChange={e => {
                        setcurrentState(Number(e.target.value));
                        setCity("");
                      }}
                      className="mt-2 w-full border border-neutral-30 rounded-lg px-3 py-2"
                      disabled={!country}
                    >
                      <option value="">Select State</option>
                      {stateList.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-primary-dark-blue font-gabarito font-medium">
                      Select City
                    </Label>
                    <select
                      value={city || ''}
                      onChange={e => setCity(e.target.value)}
                      className="mt-2 w-full border border-neutral-30 rounded-lg px-3 py-2"
                      disabled={!currentState}
                    >
                      <option value="">Select City</option>
                      {citiesList.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            {/* Additional Questions */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-gabarito font-semibold text-primary-dark-blue mb-2">
                  Do You Belong to a Buying Group / Group Purchasing
                  Organization (GPO)?
                </h3>
                <p className="text-neutral-60 text-sm mb-4">
                  Examples: PSI, VWG, PVO, Vetcove, etc.
                </p>
                <div className="flex gap-4">
                  <Button className="bg-primary-dark-blue text-white">
                    Yes
                  </Button>
                  <Button variant="outline">No</Button>
                  <Button variant="outline">Not Sure</Button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-gabarito font-semibold text-primary-dark-blue mb-2">
                  Is Your Practice Owned by a Corporate Hospital Group?
                </h3>
                <p className="text-neutral-60 text-sm mb-4">
                  Examples: VCA, PVA, VetCare, etc.
                </p>
                <div className="flex gap-4">
                  <Button variant="outline">Yes</Button>
                  <Button className="bg-primary-dark-blue text-white">
                    No
                  </Button>
                  <Button variant="outline">Not Sure</Button>
                </div>
              </div>
            </div>
            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t border-neutral-20">
              <Button
                variant="outline"
                onClick={() => setShowClinicForm(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleClinicSubmit}
                className="flex-1 bg-primary-dark-blue text-white"
              >
                {showClinicForm === "create"
                  ? "Create Clinic"
                  : "Update Clinic"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClinicManagementForm;
