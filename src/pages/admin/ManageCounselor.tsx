import React, { useState } from "react";
import { NavBar } from "./NavBar"; // Update path as needed

interface Counselor {
  name: string;
  email: string;
  profile: string;
}

const counselors: Counselor[] = [
  {
    name: "Sarah",
    email: "sarah@example.com",
    profile: "#",
  },
  {
    name: "James",
    email: "james@example.com",
    profile: "#",
  },
  {
    name: "Linda",
    email: "linda@example.com",
    profile: "#",
  },
];

export default function ManageCounselor(): JSX.Element {
  const [selected, setSelected] = useState<number[]>([]);

  const handleSelect = (idx: number) => {
    setSelected((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleSelectAll = () => {
    if (selected.length === counselors.length) {
      setSelected([]);
    } else {
      setSelected(counselors.map((_, idx) => idx));
    }
  };

  return (
    <div className="min-h-screen bg-[#ede7fa]">
      {/* Use the new NavBar */}
      <NavBar
            onLogout={() => alert('Logged out')}
            notificationCount={2}
            onProfileClick={() => alert('Profile clicked')}
            onCounselorPostsClick={() => alert('Counselor posts clicked')}
          />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-80 min-h-screen bg-[#e6def8] border-r border-[#e0d7f3] pt-12 px-8">
          <h2 className="text-2xl font-semibold text-[#4b358a] mb-12">
            Admin Dashboard
          </h2>
          <nav className="flex flex-col gap-2">
            <button className="text-left px-2 py-3 text-[#4b358a] hover:bg-[#eae2fa] rounded transition">
              Home
            </button>
            <button className="text-left px-2 py-3 text-[#4b358a] hover:bg-[#eae2fa] rounded transition">
              Manage clients
            </button>
            <button className="text-left px-2 py-3 text-[#4b358a] bg-[#d6c7f9] rounded border border-[#cfc1f4] font-medium">
              Manage Counselors
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center py-16 px-4">
          <h1 className="text-3xl font-semibold text-[#4b358a] mb-12 text-center">
            Counselor List
          </h1>
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-0 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f5f4fa] text-[#22223B] text-base font-semibold">
                  <th className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selected.length === counselors.length}
                      onChange={handleSelectAll}
                      className="accent-purple-500"
                    />
                  </th>
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Profile</th>
                </tr>
              </thead>
              <tbody>
                {counselors.map((c, idx) => (
                  <tr
                    key={c.name}
                    className={
                      selected.includes(idx)
                        ? "bg-[#ede2fa] text-[#4b358a] font-medium"
                        : "bg-white text-[#4b358a]"
                    }
                  >
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selected.includes(idx)}
                        onChange={() => handleSelect(idx)}
                        className="accent-purple-500"
                      />
                    </td>
                    <td className={`py-4 px-6 ${selected.includes(idx) ? "font-semibold" : ""}`}>
                      {c.name}
                    </td>
                    <td className={`py-4 px-6 ${selected.includes(idx) ? "font-semibold" : ""}`}>
                      <a
                        href={`mailto:${c.email}`}
                        className={selected.includes(idx) ? "text-[#4b358a] underline" : ""}
                      >
                        {c.email}
                      </a>
                    </td>
                    <td className="py-4 px-6">
                      <a
                        href={c.profile}
                        className={
                          selected.includes(idx)
                            ? "text-[#4b358a] underline font-semibold"
                            : "text-[#4b358a] underline"
                        }
                      >
                        View Profile
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
