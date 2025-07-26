import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Check, ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

interface ClinicFormData {
  clinicName: string;
  email: string;
  phone: string;
  streetAddress: string;
  suite: string;
  zipCode: string;
  city: string;
  state: string;
  species: string[];
  practiceTypes: string[];
  aboutClinic: string;
  howDidYouHear: string;
}

interface VendorFormData {
  belongsToBuyingGroup: string;
  buyingGroupName: string;
  isCorporateHospital: string;
  corporateHospitalName: string;
}

const speciesOptions = [
  { id: "dogs", label: "Dogs", icon: "🐕" },
  { id: "cats", label: "Cats", icon: "🐱" },
  { id: "birds", label: "Birds", icon: "🦅" },
  { id: "exotics", label: "Exotics", icon: "🦎" },
  { id: "horses", label: "Horses", icon: "🐴" },
  { id: "farm", label: "Farm Animals", icon: "🐄" },
  { id: "wildlife", label: "Wildlife", icon: "🦉" },
  { id: "aquatic", label: "Aquatic", icon: "🐠" },
];

const practiceTypeOptions = [
  { id: "general", label: "General Practice" },
  { id: "emergency", label: "Emergency" },
  { id: "specialty", label: "Specialty" },
  { id: "exotics", label: "Exotics" },
  { id: "equine", label: "Equine" },
  { id: "mobile", label: "Mobile" },
  { id: "nonprofit", label: "Nonprofit" },
  { id: "university", label: "University" },
  { id: "zoo", label: "Zoo/Aquarium" },
  { id: "shelter", label: "Shelter/Rescue" },
];

export default function Signup() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [userData, setUserData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [clinicData, setClinicData] = useState<ClinicFormData>({
    clinicName: "",
    email: "",
    phone: "",
    streetAddress: "",
    suite: "",
    zipCode: "",
    city: "",
    state: "",
    species: [],
    practiceTypes: [],
    aboutClinic: "",
    howDidYouHear: "",
  });

  const [vendorData, setVendorData] = useState<VendorFormData>({
    belongsToBuyingGroup: "",
    buyingGroupName: "",
    isCorporateHospital: "",
    corporateHospitalName: "",
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const handleUserDataChange = (field: keyof UserFormData, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClinicDataChange = (
    field: keyof ClinicFormData,
    value: string | string[],
  ) => {
    setClinicData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVendorDataChange = (
    field: keyof VendorFormData,
    value: string,
  ) => {
    setVendorData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSpeciesToggle = (species: string) => {
    setClinicData((prev) => ({
      ...prev,
      species: prev.species.includes(species)
        ? prev.species.filter((s) => s !== species)
        : [...prev.species, species],
    }));
  };

  const handlePracticeTypeToggle = (practiceType: string) => {
    setClinicData((prev) => ({
      ...prev,
      practiceTypes: prev.practiceTypes.includes(practiceType)
        ? prev.practiceTypes.filter((type) => type !== practiceType)
        : [...prev.practiceTypes, practiceType],
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          userData.firstName &&
          userData.lastName &&
          userData.email &&
          userData.password &&
          userData.confirmPassword &&
          userData.phone &&
          userData.password === userData.confirmPassword
        );
      case 2:
        return !!(
          clinicData.clinicName &&
          clinicData.email &&
          clinicData.phone &&
          clinicData.streetAddress &&
          clinicData.zipCode &&
          clinicData.city &&
          clinicData.state &&
          clinicData.species.length > 0 &&
          clinicData.practiceTypes.length > 0
        );
      case 3:
        return !!(
          vendorData.belongsToBuyingGroup && vendorData.isCorporateHospital
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      // Handle final submission
      console.log("Registration data:", { userData, clinicData, vendorData });
      // Redirect to login or dashboard
      navigate("/login");
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step <= currentStep
                  ? "bg-primary-dark-blue border-primary-dark-blue text-white"
                  : "border-neutral-40 text-neutral-40"
              }`}
            >
              {step < currentStep ? <Check className="w-5 h-5" /> : step}
            </div>
            {step < 3 && (
              <div
                className={`w-16 h-0.5 mx-2 ${
                  step < currentStep ? "bg-primary-dark-blue" : "bg-neutral-40"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStepLabels = () => (
    <div className="flex justify-center mb-8">
      <div className="flex space-x-8 text-sm">
        <div
          className={`text-center ${currentStep === 1 ? "text-primary-dark-blue font-bold" : "text-neutral-60"}`}
        >
          <div>User</div>
          <div>Information</div>
        </div>
        <div
          className={`text-center ${currentStep === 2 ? "text-primary-dark-blue font-bold" : "text-neutral-60"}`}
        >
          <div>Clinic</div>
          <div>Information</div>
        </div>
        <div
          className={`text-center ${currentStep === 3 ? "text-primary-dark-blue font-bold" : "text-neutral-60"}`}
        >
          <div>Vendor</div>
          <div>Information</div>
        </div>
      </div>
    </div>
  );

  const renderUserInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-gabarito font-bold text-primary-dark-blue mb-2">
          Let's Learn About You!
        </h2>
        <p className="text-neutral-60 text-sm">
          This information is used to verify your registration and customize
          your shopping experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="firstName"
            className="text-neutral-80 font-gabarito font-bold"
          >
            First Name
          </Label>
          <Input
            id="firstName"
            value={userData.firstName}
            onChange={(e) => handleUserDataChange("firstName", e.target.value)}
            placeholder="First name"
            className="rounded-lg border-neutral-40 focus:border-primary-dark-blue"
            required
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="lastName"
            className="text-neutral-80 font-gabarito font-bold"
          >
            Last Name
          </Label>
          <Input
            id="lastName"
            value={userData.lastName}
            onChange={(e) => handleUserDataChange("lastName", e.target.value)}
            placeholder="Last name"
            className="rounded-lg border-neutral-40 focus:border-primary-dark-blue"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-neutral-80 font-gabarito font-bold"
        >
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          value={userData.email}
          onChange={(e) => handleUserDataChange("email", e.target.value)}
          placeholder="Enter your email"
          className="rounded-lg border-neutral-40 focus:border-primary-dark-blue"
          required
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="phone"
          className="text-neutral-80 font-gabarito font-bold"
        >
          Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          value={userData.phone}
          onChange={(e) => handleUserDataChange("phone", e.target.value)}
          placeholder="Enter your phone number"
          className="rounded-lg border-neutral-40 focus:border-primary-dark-blue"
          required
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-neutral-80 font-gabarito font-bold"
        >
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={userData.password}
            onChange={(e) => handleUserDataChange("password", e.target.value)}
            placeholder="Create a password"
            className="rounded-lg border-neutral-40 focus:border-primary-dark-blue pr-10"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-neutral-40" />
            ) : (
              <Eye className="h-4 w-4 text-neutral-40" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="confirmPassword"
          className="text-neutral-80 font-gabarito font-bold"
        >
          Confirm Password
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={userData.confirmPassword}
            onChange={(e) =>
              handleUserDataChange("confirmPassword", e.target.value)
            }
            placeholder="Confirm your password"
            className="rounded-lg border-neutral-40 focus:border-primary-dark-blue pr-10"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 text-neutral-40" />
            ) : (
              <Eye className="h-4 w-4 text-neutral-40" />
            )}
          </Button>
        </div>
        {userData.password &&
          userData.confirmPassword &&
          userData.password !== userData.confirmPassword && (
            <p className="text-red-500 text-sm">Passwords do not match</p>
          )}
      </div>
    </div>
  );

  const renderClinicInfoStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-gabarito font-bold text-primary-dark-blue mb-2">
          Let's Learn About Your Clinic!
        </h2>
        <p className="text-neutral-60 text-sm">
          This information is used to verify your registration and customize
          your shopping experience.
        </p>
      </div>

      {/* Species Selection */}
      <div>
        <h3 className="text-lg font-gabarito font-semibold text-primary-dark-blue mb-4">
          SELECT ALL SPECIES TREATED BY YOUR PRACTICE <span className="text-red-500">*</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {speciesOptions.map((species) => (
            <div
              key={species.id}
              onClick={() => handleSpeciesToggle(species.id)}
              className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all ${
                clinicData.species.includes(species.id)
                  ? "border-primary-dark-blue bg-secondary-yellow40"
                  : "border-neutral-30 hover:border-primary-dark-blue/50"
              }`}
            >
              <div className="w-16 h-16 mx-auto mb-2 bg-neutral-10 rounded-lg flex items-center justify-center">
                <span className="text-2xl">{species.icon}</span>
              </div>
              <span className="font-gabarito font-medium text-primary-dark-blue">
                {species.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Practice Type */}
      <div>
        <h3 className="text-lg font-gabarito font-semibold text-primary-dark-blue mb-4">
          PRACTICE TYPE (SELECT ALL THAT APPLY) <span className="text-red-500">*</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {practiceTypeOptions.map((type) => (
            <label
              key={type.id}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={clinicData.practiceTypes.includes(type.id)}
                onChange={() => handlePracticeTypeToggle(type.id)}
                className="w-5 h-5 text-primary-dark-blue rounded border-neutral-30 focus:ring-primary-dark-blue/20"
              />
              <span className="text-primary-dark-blue font-gabarito font-medium text-sm">
                {type.label}
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
                value={clinicData.clinicName}
                onChange={(e) => handleClinicDataChange("clinicName", e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-primary-dark-blue font-gabarito font-medium">
                Clinic Email
              </Label>
              <Input
                placeholder="Enter the Clinic Email"
                value={clinicData.email}
                onChange={(e) => handleClinicDataChange("email", e.target.value)}
                className="mt-2"
                type="email"
              />
            </div>
            <div>
              <Label className="text-primary-dark-blue font-gabarito font-medium">
                Clinic Phone
              </Label>
              <Input
                placeholder="Enter the Clinic Phone"
                value={clinicData.phone}
                onChange={(e) => handleClinicDataChange("phone", e.target.value)}
                className="mt-2"
                type="tel"
              />
            </div>
            <div>
              <Label className="text-primary-dark-blue font-gabarito font-medium">
                Clinic Street Address
              </Label>
              <Input
                placeholder="Enter the Clinic Street Address"
                value={clinicData.streetAddress}
                onChange={(e) => handleClinicDataChange("streetAddress", e.target.value)}
                className="mt-2"
                required
              />
            </div>
            <div>
              <Label className="text-primary-dark-blue font-gabarito font-medium">
                Suite/Building, etc.
              </Label>
              <Input
                placeholder="Enter the Suite, Building, etc."
                value={clinicData.suite}
                onChange={(e) => handleClinicDataChange("suite", e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-primary-dark-blue font-gabarito font-medium">
                Zip Code
              </Label>
              <Input
                placeholder="Enter the Zip Code"
                value={clinicData.zipCode}
                onChange={(e) => handleClinicDataChange("zipCode", e.target.value)}
                className="mt-2"
                required
              />
            </div>
            <div>
              <Label className="text-primary-dark-blue font-gabarito font-medium">
                City
              </Label>
              <Input
                placeholder="Enter the City"
                value={clinicData.city}
                onChange={(e) => handleClinicDataChange("city", e.target.value)}
                className="mt-2"
                required
              />
            </div>
            <div>
              <Label className="text-primary-dark-blue font-gabarito font-medium">
                State
              </Label>
              <Select
                value={clinicData.state}
                onValueChange={(value) => handleClinicDataChange("state", value)}
              >
                <SelectTrigger className="mt-2 border-neutral-30">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                  <SelectItem value="TX">Texas</SelectItem>
                  <SelectItem value="FL">Florida</SelectItem>
                  <SelectItem value="IL">Illinois</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>



      {/* Optional Information */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-primary-dark-blue font-gabarito font-medium">
            HOW DID YOU HEAR ABOUT US?
          </Label>
          <Textarea
            value={clinicData.howDidYouHear}
            onChange={(e) =>
              handleClinicDataChange("howDidYouHear", e.target.value)
            }
            placeholder="Referral/show, Conference, etc."
            className="rounded-lg border-neutral-30 focus:border-primary-dark-blue"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-primary-dark-blue font-gabarito font-medium">
            TELL US MORE ABOUT YOUR CLINIC
          </Label>
          <Textarea
            value={clinicData.aboutClinic}
            onChange={(e) =>
              handleClinicDataChange("aboutClinic", e.target.value)
            }
            placeholder="Brief description of your clinic..."
            className="rounded-lg border-neutral-30 focus:border-primary-dark-blue"
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  const renderVendorInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-gabarito font-bold text-primary-dark-blue mb-2">
          Vendor Information
        </h2>
        <p className="text-neutral-60 text-sm">
          Help us understand your purchasing relationships.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-neutral-80 font-gabarito font-bold">
            DO YOU BELONG TO A BUYING GROUP / GROUP PURCHASING ORGANIZATION
            (GPO)?
          </Label>
          <RadioGroup
            value={vendorData.belongsToBuyingGroup}
            onValueChange={(value) =>
              handleVendorDataChange("belongsToBuyingGroup", value)
            }
          >
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="buying-group-yes" />
                <Label htmlFor="buying-group-yes" className="text-neutral-80">
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="buying-group-no" />
                <Label htmlFor="buying-group-no" className="text-neutral-80">
                  No
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not-sure" id="buying-group-not-sure" />
                <Label
                  htmlFor="buying-group-not-sure"
                  className="text-neutral-80"
                >
                  Not Sure
                </Label>
              </div>
            </div>
          </RadioGroup>

          {vendorData.belongsToBuyingGroup === "yes" && (
            <div className="space-y-2">
              <Label className="text-neutral-80 font-gabarito font-bold">
                IF YES, WHICH ONE? (OR WHICH ONES?)
              </Label>
              <Textarea
                value={vendorData.buyingGroupName}
                onChange={(e) =>
                  handleVendorDataChange("buyingGroupName", e.target.value)
                }
                placeholder="Example: CS, BuyVet, PBI, Vetcove, etc."
                className="rounded-lg border-neutral-40 focus:border-primary-dark-blue"
                rows={3}
              />
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-4">
          <Label className="text-neutral-80 font-gabarito font-bold">
            IS YOUR PRACTICE OWNED BY A CORPORATE / HOSPITAL GROUP?
          </Label>
          <RadioGroup
            value={vendorData.isCorporateHospital}
            onValueChange={(value) =>
              handleVendorDataChange("isCorporateHospital", value)
            }
          >
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="corporate-yes" />
                <Label htmlFor="corporate-yes" className="text-neutral-80">
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="corporate-no" />
                <Label htmlFor="corporate-no" className="text-neutral-80">
                  No
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not-sure" id="corporate-not-sure" />
                <Label htmlFor="corporate-not-sure" className="text-neutral-80">
                  Not Sure
                </Label>
              </div>
            </div>
          </RadioGroup>

          {vendorData.isCorporateHospital === "yes" && (
            <div className="space-y-2">
              <Label className="text-neutral-80 font-gabarito font-bold">
                IF YES, WHICH ONE? (OR WHICH ONES?)
              </Label>
              <Textarea
                value={vendorData.corporateHospitalName}
                onChange={(e) =>
                  handleVendorDataChange(
                    "corporateHospitalName",
                    e.target.value,
                  )
                }
                placeholder="Example: VCA, BluePearl, NVA, Ethos, etc."
                className="rounded-lg border-neutral-40 focus:border-primary-dark-blue"
                rows={3}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-gradient flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-[120px] h-[40px] bg-primary-dark-blue rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-neutral-0 font-gabarito font-bold text-lg">
              PetMart
            </span>
          </div>
          <Progress value={progress} className="mb-4" />
          {renderStepIndicator()}
          {renderStepLabels()}
        </CardHeader>

        <CardContent>
          <form className="space-y-6">
            {currentStep === 1 && renderUserInfoStep()}
            {currentStep === 2 && renderClinicInfoStep()}
            {currentStep === 3 && renderVendorInfoStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!validateStep(currentStep)}
                  className="bg-primary-dark-blue hover:bg-primary-dark-blue80 text-neutral-0 flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!validateStep(currentStep)}
                  className="bg-primary-dark-blue hover:bg-primary-dark-blue80 text-neutral-0"
                >
                  Complete Registration
                </Button>
              )}
            </div>

            {/* Help Text */}
            <div className="text-center pt-4">
              <span className="text-neutral-60 text-sm">
                Need help? Let's chat!
              </span>
              <Button
                type="button"
                variant="link"
                className="text-primary-dark-blue hover:text-primary-dark-blue80 ml-1 p-0 text-sm"
              >
                NEED HELP? LET'S CHAT!
              </Button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <span className="text-neutral-60 text-sm">
                Already have an account?
              </span>
              <Link
                to="/login"
                className="text-primary-dark-blue hover:text-primary-dark-blue80 ml-1 font-medium"
              >
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
