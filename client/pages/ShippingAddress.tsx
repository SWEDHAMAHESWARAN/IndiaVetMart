import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { MyContext } from "../App";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GetCountries, GetState, GetCity } from "react-country-state-city";
import { postData } from "@/lib/api";
const AddressManagement = () => {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const context = useContext(MyContext);
  const { shippingAddress = [], user = "{}" } = context || {};

  interface UserDetails {
    clinicname?: string;
    clinicemail?: string;
  }
  const [userDetails, setUserDetails] = useState<UserDetails>({});
  const [formData, setFormData] = useState({
    clinicName: "",
    phoneNumber: "",
    streetAddress: "",
    building: "",
    zipCode: "",
    city: "",
    state: "",
  });
  const [currentState, setcurrentState] = useState("");
  const [citiesList, setCitiesList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [country, setCountry] = useState(null);
  const [city, setCity] = useState("");
  const [countriesList, setCountriesList] = useState([]);
  const [trigger, setTrigger] = useState(false);
  useEffect(() => {
    console.log(`Fetch data`);
    try {
      const details = user ? JSON.parse(user) : {};
      setUserDetails(details);
    } catch (e) {
      console.error("Invalid user JSON:", e);
      setUserDetails({});
    }
    fetchShippingAddressData();
  }, [trigger]);

  const fetchShippingAddressData = async () => {
    try {
      context.fetchShippingAddress();
    } catch (err) {
      console.error("Error fetching shipping addresses:", err);
    }
  };

  useEffect(() => {
    GetCountries().then((result: Array<{ id: number; name: string }>) => {
      setCountriesList(result);
      const india = result.find((c) => c.name === "India");
      if (india) {
        setCountry(india.id);
      }
    });
  }, []);
  useEffect(() => {
    if (country) console.log("country", parseInt(country));
    GetState(parseInt(country)).then(
      (result: Array<{ id: number; name: string }>) => {
        const excludedStates = [
          "Andaman and Nicobar Islands",
          "Chandigarh",
          "Dadra and Nagar Haveli and Daman and Diu",
          "Delhi",
          "Jammu and Kashmir",
          "Ladakh",
          "Lakshadweep",
          "Puducherry",
        ];
        const filteredStates = result.filter(
          (state) => !excludedStates.includes(state.name),
        );

        setStateList(filteredStates);
      },
    );
  }, [country]);
  useEffect(() => {
    if (country && currentState) console.log("currentState", currentState);
    GetCity(parseInt(country), parseInt(currentState)).then((result) => {
      setCitiesList(result);
    });
  }, [country, currentState]);

  // handle for add shipping address
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async () => {
    const newErrors = {};
    // if (formData.streetAddress === "") {
    //   context.setAlertBox({
    //     open: true,
    //     error: true,
    //     msg: ClinicForms.Clinics.Clinicstreetaddress,
    //   });
    //   return false;
    // }

    // if (formData.building === "") {
    //   context.setAlertBox({
    //     open: true,
    //     error: true,
    //     msg: ClinicForms.Clinics.ClinicBuilding,
    //   });
    //   return false;
    // }
    // if (formData.zipCode === "") {
    //   context.setAlertBox({
    //     open: true,
    //     error: true,
    //     msg: ClinicForms.Clinics.Cliniczipcode,
    //   });
    //   return false;
    // }
    // if (!/^\d{6}$/.test(formData.zipCode)) {
    //   newErrors.zipCode = "Zip Code must be 6 digits.";
    //   context.setAlertBox({
    //     open: true,
    //     error: true,
    //     msg: ClinicForms.Clinics.verifycliniczipcode,
    //   });

    //   return false;
    // }

    // if (!findStateList?.name) {
    //   context.setAlertBox({
    //     open: true,
    //     error: true,
    //     msg: ClinicForms.Clinics.Clinicstate,
    //   });
    //   return false;
    // }
    // if (!fintcityList?.name) {
    //   context.setAlertBox({
    //     open: true,
    //     error: true,
    //     msg: ClinicForms.Clinics.ClinicCity,
    //   });
    //   return false;
    // }
    try {
      console.log("current ssate", currentState);
      console.log("state list", JSON.stringify(stateList));
      const selectedState = stateList.find(
        (s) => String(s.id) === String(currentState),
      );

      const findCity = citiesList.find((c) => String(c.id) === String(city));

      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const payload = {
        ...formData,
        clinicId: user?.clinicId,
        active: true,
        default_address: false,
        building: formData.building,
        streetAddress: formData.streetAddress,
        zipCode: formData.zipCode,
        city: findCity?.name,
        state: selectedState?.name,
      };

      console.log("payLaod", payload);
      await postData("/api/shipping/create", payload).then((res) => {
        console.log(`Res ${JSON.stringify(res)}`);
        if (res.status === 200 || 201) {
          setFormData({
            clinicName: "",
            phoneNumber: "",
            streetAddress: "",
            building: "",
            zipCode: "",
            city: "",
            state: "",
          });
          setcurrentState("");
          setCity("");
          setTrigger((prev) => !prev);
          setShowAddressForm(false);
          // context.setAlertBox({
          //   open: true,
          //   error: false,
          //   msg: res.message,
          // });
          return false;
        } else {
          // context.setAlertBox({
          //   open: true,
          //   error: false,
          //   msg: res.message,
          // });
          return false;
        }
      });
    } catch (err) {
      console.error("Error creating address:", err);
    }
  };

  const handleCancel = () => {
    setShowAddressForm(false);
    setFormData({
      clinicName: "",
      phoneNumber: "",
      streetAddress: "",
      building: "",
      zipCode: "",
      city: "",
      state: "",
    });
    setcurrentState("");
    setCity("");
  };

  const handleDefaultAddress = async (currentShipping) => {
    try {
      const payLoad = {
        _id: currentShipping?._id,
        clinicId: currentShipping.clinicId,
        default_address: true,
      };
      await postData(`/api/shipping/create`, payLoad).then((res) => {
        if (res.status === 200 || 201) {
          setTrigger((prev) => !prev);
          // context.setAlertBox({
          //   open: true,
          //   error: false,
          //   msg: res.message,
          // });
          // return false;
        } else {
          // context.setAlertBox({
          //   open: true,
          //   error: true,
          //   msg: res.message,
          // });
          // return false;
        }
      });
    } catch (err) {
      console.error(`Error setting default address: ${err}`);
    }
  };

  const handleDeleteAddress = async (currentShipping) => {
    try {
      const payLoad = {
        _id: currentShipping?._id,
        active: false,
      };
      await postData(`/api/shipping/create`, payLoad).then((res) => {
        if (res.status === 200 || 201) {
          // context.setAlertBox({
          //   open: true,
          //   error: true,
          //   msg: res.message,
          // });
          // return false;
        }
      });
      setTrigger((prev) => !prev);
    } catch (err) {
      console.error(`Error deleting address: ${err}`);
    }
  };

  return (
    <>
      <Card className="bg-white shadow-lg border border-neutral-20 rounded-2xl">
        <CardHeader className="p-6 border-b border-neutral-20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-gabarito font-bold text-primary-dark-blue">
              Manage Shipping Addresses
            </CardTitle>
            <Button
              onClick={() => setShowAddressForm(true)}
              className="bg-primary-dark-blue hover:bg-primary-dark-blue80 text-white rounded-lg"
            >
              CREATE NEW ADDRESS
            </Button>
          </div>
          <p className="text-neutral-60 text-sm mt-2">
            Add or remove shipping addresses from the list below. A valid
            address is required for purchasing Indian Vet Mart Commerce items
            and redeeming Indian Vet Mart rewards.
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {shippingAddress.map((address) => (
              <div
                key={address.id}
                className="flex items-center justify-between p-4 border border-neutral-20 rounded-lg"
              >
                <div>
                  <h4 className="font-gabarito font-semibold text-primary-dark-blue">
                    {userDetails?.clinicname}
                  </h4>
                  <p className="text-neutral-60 text-sm whitespace-pre-line">
                    {address.building} {address.streetAddress}
                  </p>
                  <p className="text-neutral-60 text-sm whitespace-pre-line">
                    {address.city}
                  </p>
                  <p className="text-neutral-60 text-sm whitespace-pre-line">
                    {address.state}
                  </p>
                  <p className="text-neutral-60 text-sm whitespace-pre-line">
                    {address.zipCode}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={address.default_address ? "default" : "outline"}
                    onClick={() => handleDefaultAddress(address)}
                    className={
                      address.default_address
                        ? "bg-primary-dark-blue text-white"
                        : "border-primary-dark-blue text-primary-dark-blue"
                    }
                    size="sm"
                  >
                    SET AS DEFAULT
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteAddress(address)}
                    className="border-red-500 text-red-500 hover:bg-red-50"
                    size="sm"
                  >
                    DELETE
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create an Address</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div>
              <Label>Clinic Name*</Label>
              <Input
                className="mt-1"
                value={userDetails?.clinicname}
                readOnly
              />
            </div>
            <div>
              <Label>Clinic Email*</Label>
              <Input
                className="mt-1"
                value={userDetails?.clinicemail}
                readOnly
              />
            </div>
            <div className="md:col-span-2">
              <Label>Address Line One*</Label>
              <Input
                name="streetAddress"
                placeholder="Address Line"
                className="mt-1"
                value={formData?.streetAddress}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>APT/Suite</Label>
              <Input
                name="building"
                placeholder="Enter the APT Suite"
                className="mt-1"
                value={formData?.building}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Postal Code*</Label>
              <Input
                name="zipCode"
                className="mt-1"
                value={formData?.zipCode}
                onChange={handleChange}
              />
            </div>

            {/* State Dropdown */}
            <div>
              <Label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                State*
              </Label>
              <select
                id="state"
                name="state"
                value={currentState}
                onChange={(e) => setcurrentState(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 shadow-sm focus:border-primary-dark-blue focus:ring focus:ring-primary-dark-blue/30"
              >
                <option value="" disabled>
                  Select a State
                </option>
                {stateList.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            {/* City Dropdown */}
            <div>
              <Label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                City*
              </Label>
              <select
                id="city"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!currentState}
                className={`mt-1 block w-full rounded-md border bg-white p-2 shadow-sm focus:ring focus:ring-primary-dark-blue/30 ${
                  !currentState
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 focus:border-primary-dark-blue"
                }`}
              >
                <option value="" disabled>
                  {currentState ? "Select a City" : "Select a State first"}
                </option>
                {citiesList.map((cityItem) => (
                  <option key={cityItem.id} value={cityItem.id}>
                    {cityItem.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              CANCEL
            </Button>
            <Button
              className="flex-1 bg-primary-dark-blue text-white"
              onClick={handleSubmit}
            >
              CREATE ADDRESS
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default AddressManagement;
