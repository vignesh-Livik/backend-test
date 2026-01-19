import { useState } from "react";
import {
  Award,
  MapPin,
  Calendar,
  SquarePen,
  Trash,
  GraduationCap,
  Building,
  University,
  Percent,
  User,
  Hash,
  Sparkles,
  Clock,
  Target,
} from "lucide-react";

/* Tailwind reusable classes */
const thClass =
  "px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200";
const tdClass = "px-6 py-4 text-sm text-gray-800";

function EducationTable({ data, onEdit, onDelete }) {
  const [selectedRow, setSelectedRow] = useState(null);

  if (!Array.isArray(data) || data.length === 0) return null;

  // Calculate statistics for the summary bar
  const stats = {
    total: data.length,
    recent: data.filter(
      (edu) => new Date().getFullYear() - edu.yearOfPassing <= 5
    ).length,
    highAchievers: data.filter((edu) => edu.percentage >= 75).length,
    avgPercentage:
      data.length > 0
        ? (
            data.reduce((sum, edu) => sum + (edu.percentage || 0), 0) /
            data.length
          ).toFixed(1)
        : 0,
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <GraduationCap className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 font-medium">
                Recent (≤5 yrs)
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.recent}</p>
            </div>
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Clock className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-violet-50 to-violet-100 border border-violet-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-violet-600 font-medium">Avg. Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.avgPercentage}%
              </p>
            </div>
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Target className="h-5 w-5 text-violet-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className=" rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className={`${thClass} pl-8 text-left`}>
                  <div className="flex items-center space-x-2">
                    <span>ID / User</span>
                  </div>
                </th>
                <th className={`${thClass} text-center`}>
                  <div className="flex items-center justify-center space-x-2">
                    <span>Qualification</span>
                  </div>
                </th>
                <th className={`${thClass} text-center`}>Specialization</th>
                <th className={`${thClass} text-center`}>
                  <div className="flex items-center justify-center space-x-2">
                    <span>Institution</span>
                  </div>
                </th>
                <th className={`${thClass} text-center`}>
                  <div className="flex items-center justify-center space-x-2">
                    <span>Board / University</span>
                  </div>
                </th>
                <th className={`${thClass} text-center`}>
                  <div className="flex items-center justify-center space-x-2">
                    <span>Year</span>
                  </div>
                </th>
                <th className={`${thClass} text-center`}>
                  <div className="flex items-center justify-center space-x-2">
                    <span>Percentage</span>
                  </div>
                </th>
                <th className={`${thClass} pr-8 text-right`}>Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {data.map((edu, index) => {
                const currentYear = new Date().getFullYear();
                const yearsAgo = currentYear - edu.yearOfPassing;
                const isRecent = yearsAgo <= 5;

                return (
                  <tr
                    key={edu.id}
                    onClick={() =>
                      setSelectedRow(selectedRow === index ? null : index)
                    }
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className={`${tdClass} pl-8 text-left`}>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded">
                            {edu.id}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            UserID: {edu.userId}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className={`${tdClass} text-center`}>
                      <div className="flex items-center justify-center space-x-3">
                        <div />
                        <span className="font-semibold text-gray-900">
                          {edu.qualification}
                        </span>
                      </div>
                    </td>

                    <td className={`${tdClass} text-center`}>
                      {edu.specialization ? (
                        <div className="flex justify-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {edu.specialization}
                          </span>
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <span className="text-gray-400">—</span>
                        </div>
                      )}
                    </td>

                    <td className={`${tdClass} text-center`}>
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900 flex items-center justify-center space-x-2">
                          <span>{edu.institution}</span>
                        </div>
                      </div>
                    </td>

                    <td className={`${tdClass} text-center`}>
                      <div className="text-gray-700">
                        {edu.boardOrUniversity}
                      </div>
                    </td>

                    <td className={`${tdClass} text-center`}>
                      <div className="space-y-1">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="font-semibold">
                            {edu.yearOfPassing}
                          </span>
                        </div>
                        <div>
                          {isRecent ? "Recent" : `${yearsAgo} years ago`}
                        </div>
                      </div>
                    </td>

                    <td className={`${tdClass} text-center`}>
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2">
                          <span>
                            {edu.percentage ? `${edu.percentage}%` : "N/A"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className={`${tdClass} pr-8 text-right`}>
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(edu);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-105"
                          title="Edit"
                        >
                          <SquarePen className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(edu.id);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-105"
                          title="Delete"
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600">
            <div className="text-right">
              <span className="font-semibold text-gray-900">{data.length}</span>{" "}
              academic records
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EducationTable;
