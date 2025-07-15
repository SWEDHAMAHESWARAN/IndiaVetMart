import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BudgetItem {
  id: string;
  timePeriod: string;
  dateRange: string;
  spend: number;
  adjustments: number;
  budget: number;
  remaining: number;
  percentSpend: number;
  status: "warning" | "normal" | "danger";
}

type BudgetType = "weekly" | "monthly" | "yearly";

export default function Budget() {
  const [activeTab, setActiveTab] = useState<BudgetType>("weekly");
  const [isAddingBudget, setIsAddingBudget] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("");

  const weeklyBudgets: BudgetItem[] = [
    {
      id: "w26",
      timePeriod: "Week #26",
      dateRange: "23 June 2025 - 29 June 2025",
      spend: 122700,
      adjustments: 2550,
      budget: 51002,
      remaining: 1205,
      percentSpend: 75.2,
      status: "warning",
    },
    {
      id: "w27",
      timePeriod: "Week #27",
      dateRange: "30 June 2025 - 06 July 2025",
      spend: 6545,
      adjustments: 325,
      budget: 9302,
      remaining: 2456,
      percentSpend: 75.2,
      status: "warning",
    },
    {
      id: "w28",
      timePeriod: "Week #28",
      dateRange: "07 July 2025 - 13 July 2025",
      spend: 75725,
      adjustments: 9562,
      budget: 91250,
      remaining: 524,
      percentSpend: 75.2,
      status: "warning",
    },
    {
      id: "w29",
      timePeriod: "Week #29",
      dateRange: "14 July 2025 - 20 July 2025",
      spend: 732,
      adjustments: 78654,
      budget: 94521,
      remaining: 123,
      percentSpend: 75.2,
      status: "warning",
    },
  ];

  const monthlyBudgets: BudgetItem[] = [
    {
      id: "m1",
      timePeriod: "January 2025",
      dateRange: "01 Jan 2025 - 31 Jan 2025",
      spend: 485200,
      adjustments: 12500,
      budget: 200000,
      remaining: 8500,
      percentSpend: 82.5,
      status: "danger",
    },
  ];

  const yearlyBudgets: BudgetItem[] = [
    {
      id: "y1",
      timePeriod: "2025",
      dateRange: "01 Jan 2025 - 31 Dec 2025",
      spend: 2850000,
      adjustments: 125000,
      budget: 3000000,
      remaining: 150000,
      percentSpend: 95.0,
      status: "danger",
    },
  ];

  const getCurrentBudgets = () => {
    switch (activeTab) {
      case "weekly":
        return weeklyBudgets;
      case "monthly":
        return monthlyBudgets;
      case "yearly":
        return yearlyBudgets;
      default:
        return weeklyBudgets;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "weekly":
        return "Weekly Budgets";
      case "monthly":
        return "Monthly Budgets";
      case "yearly":
        return "Yearly Budgets";
      default:
        return "Weekly Budgets";
    }
  };

  const getFilterLabel = () => {
    switch (activeTab) {
      case "weekly":
        return "Filter by Weeks";
      case "monthly":
        return "Filter by Months";
      case "yearly":
        return "Filter by Years";
      default:
        return "Filter by Weeks";
    }
  };

  const getAddButtonText = () => {
    switch (activeTab) {
      case "weekly":
        return "Add Weekly Budget";
      case "monthly":
        return "Add Monthly Budget";
      case "yearly":
        return "Add Yearly Budget";
      default:
        return "Add Budget";
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "warning":
        return "bg-orange-100 text-orange-800";
      case "danger":
        return "bg-red-100 text-red-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const handleAddBudget = () => {
    // Handle adding new budget
    console.log("Adding budget:", {
      selectedPeriod,
      budgetAmount,
      type: activeTab,
    });
    setIsAddingBudget(false);
    setSelectedPeriod("");
    setBudgetAmount("");
  };

  return (
    <div className="min-h-screen bg-neutral-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/profile">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-dark-blue"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2 text-sm text-neutral-60 mb-1">
                <span>Home</span>
                <span>›</span>
                <span>Budget</span>
              </div>
              <h1 className="text-3xl font-gabarito font-bold text-primary-dark-blue">
                {getTabTitle()}
              </h1>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={activeTab === "weekly" ? "default" : "outline"}
              className={`${
                activeTab === "weekly"
                  ? "bg-secondary-yellow80 text-primary-dark-blue border-secondary-yellow80"
                  : "border-primary-dark-blue text-primary-dark-blue hover:bg-secondary-yellow40"
              }`}
              onClick={() => setActiveTab("weekly")}
            >
              Weekly
            </Button>
            <Button
              variant={activeTab === "monthly" ? "default" : "outline"}
              className={`${
                activeTab === "monthly"
                  ? "bg-secondary-yellow80 text-primary-dark-blue border-secondary-yellow80"
                  : "border-primary-dark-blue text-primary-dark-blue hover:bg-secondary-yellow40"
              }`}
              onClick={() => setActiveTab("monthly")}
            >
              Monthly
            </Button>
            <Button
              variant={activeTab === "yearly" ? "default" : "outline"}
              className={`${
                activeTab === "yearly"
                  ? "bg-secondary-yellow80 text-primary-dark-blue border-secondary-yellow80"
                  : "border-primary-dark-blue text-primary-dark-blue hover:bg-secondary-yellow40"
              }`}
              onClick={() => setActiveTab("yearly")}
            >
              Yearly
            </Button>
          </div>

          {/* Filter and Add Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="w-full sm:w-64">
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="border-neutral-40">
                  <SelectValue
                    placeholder={`Select the ${activeTab.slice(0, -2)}...`}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All {activeTab} periods</SelectItem>
                  <SelectItem value="current">
                    Current {activeTab.slice(0, -2)}
                  </SelectItem>
                  <SelectItem value="past">Past {activeTab} periods</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isAddingBudget} onOpenChange={setIsAddingBudget}>
              <DialogTrigger asChild>
                <Button className="bg-primary-dark-blue text-white hover:bg-primary-dark-blue/90">
                  <Plus className="w-4 h-4 mr-2" />
                  {getAddButtonText()}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-primary-dark-blue font-gabarito">
                    Add or Modify a{" "}
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -2)}{" "}
                    Budget
                  </DialogTitle>
                  <DialogDescription>
                    Enter a budget for the selected time period. The system will
                    automatically track your spend and compare it to your
                    budget.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-primary-dark-blue">
                        Select{" "}
                        {activeTab.charAt(0).toUpperCase() +
                          activeTab.slice(1, -2)}
                      </Label>
                      <Select
                        value={selectedPeriod}
                        onValueChange={setSelectedPeriod}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={`Select ${activeTab.slice(0, -2)}...`}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {activeTab === "weekly" && (
                            <>
                              <SelectItem value="week-30">Week #30</SelectItem>
                              <SelectItem value="week-31">Week #31</SelectItem>
                              <SelectItem value="week-32">Week #32</SelectItem>
                            </>
                          )}
                          {activeTab === "monthly" && (
                            <>
                              <SelectItem value="feb-2025">
                                February 2025
                              </SelectItem>
                              <SelectItem value="mar-2025">
                                March 2025
                              </SelectItem>
                              <SelectItem value="apr-2025">
                                April 2025
                              </SelectItem>
                            </>
                          )}
                          {activeTab === "yearly" && (
                            <>
                              <SelectItem value="2026">2026</SelectItem>
                              <SelectItem value="2027">2027</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-primary-dark-blue">
                        Enter the Budget
                      </Label>
                      <Input
                        type="number"
                        placeholder="Enter the Budget"
                        value={budgetAmount}
                        onChange={(e) => setBudgetAmount(e.target.value)}
                        className="border-neutral-40 focus:border-primary-dark-blue"
                      />
                    </div>
                  </div>

                  <Button
                    className="w-full bg-primary-dark-blue text-white hover:bg-primary-dark-blue/90"
                    onClick={handleAddBudget}
                    disabled={!selectedPeriod || !budgetAmount}
                  >
                    Add/Modify{" "}
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -2)}{" "}
                    Budget
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Budget Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-10">
                  <TableHead className="font-gabarito font-bold text-primary-dark-blue">
                    Time Period
                  </TableHead>
                  <TableHead className="font-gabarito font-bold text-primary-dark-blue">
                    Spend
                  </TableHead>
                  <TableHead className="font-gabarito font-bold text-primary-dark-blue">
                    Adjustments
                  </TableHead>
                  <TableHead className="font-gabarito font-bold text-primary-dark-blue">
                    Budget
                  </TableHead>
                  <TableHead className="font-gabarito font-bold text-primary-dark-blue">
                    Remaining
                  </TableHead>
                  <TableHead className="font-gabarito font-bold text-primary-dark-blue">
                    % of Spend
                  </TableHead>
                  <TableHead className="font-gabarito font-bold text-primary-dark-blue">
                    Spend & Budget
                  </TableHead>
                  <TableHead className="font-gabarito font-bold text-primary-dark-blue">
                    Delete
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getCurrentBudgets().map((budget) => (
                  <TableRow key={budget.id} className="hover:bg-neutral-5">
                    <TableCell>
                      <div>
                        <div className="font-medium text-primary-dark-blue">
                          {budget.timePeriod}
                        </div>
                        <div className="text-sm text-neutral-60">
                          {budget.dateRange}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-primary-dark-blue font-medium">
                        {formatCurrency(budget.spend)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-primary-dark-blue font-medium">
                          {formatCurrency(budget.adjustments)}
                        </span>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Edit className="w-3 h-3 text-neutral-40" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-primary-dark-blue font-medium">
                        {formatCurrency(budget.budget)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-primary-dark-blue font-medium">
                        {formatCurrency(budget.remaining)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-primary-dark-blue font-medium">
                        {budget.percentSpend}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-neutral-20 rounded-full h-2">
                          <div
                            className="bg-orange-400 h-2 rounded-full"
                            style={{ width: `${budget.percentSpend}%` }}
                          />
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(budget.status)}`}
                        >
                          Warning
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-secondary-yellow40 border-secondary-yellow60">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-dark-blue rounded-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-gabarito font-bold text-primary-dark-blue">
                    Total Budget
                  </h3>
                  <p className="text-2xl font-bold text-primary-dark-blue">
                    {formatCurrency(
                      getCurrentBudgets().reduce(
                        (sum, budget) => sum + budget.budget,
                        0,
                      ),
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500 rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-gabarito font-bold text-orange-700">
                    Total Spend
                  </h3>
                  <p className="text-2xl font-bold text-orange-700">
                    {formatCurrency(
                      getCurrentBudgets().reduce(
                        (sum, budget) => sum + budget.spend,
                        0,
                      ),
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500 rounded-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-gabarito font-bold text-green-700">
                    Remaining
                  </h3>
                  <p className="text-2xl font-bold text-green-700">
                    {formatCurrency(
                      getCurrentBudgets().reduce(
                        (sum, budget) => sum + budget.remaining,
                        0,
                      ),
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
