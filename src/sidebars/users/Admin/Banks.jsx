import React from "react";
 
const bankData = [
  {
    id: 26,
    bank: "HDFC BANK",
    url: "https://drive.google.com/file/d/1qZ0-PekooKiMgiNLQ1aTtx4uul6nwMjD/view?usp=drivesdk",
  },
  {
    id: 27,
    bank: "ICICI BANK",
    url: "https://drive.google.com/file/d/1qr4JjluqlJdOmKegK7a5e5i-MHcEgN2b/view?usp=drivesdk",
  },
  {
    id: 29,
    bank: "IDFC FIRST BANK",
    url: "https://drive.google.com/file/d/1r2NxMnsQUpFOf8_cpiTY9RDLlimAT867/view?usp=drivesdk",
  },
  {
    id: 30,
    bank: "AXIS BANK",
    url: "https://drive.google.com/file/d/1r4ZZPMaqA5E7BNFD20HBnfrPeNlkosHy/view?usp=drivesdk",
  },
  {
    id: 33,
    bank: "KOTAK BANK",
    url: "https://drive.google.com/file/d/1qwkZfCd0zkK4G7TLug3tjhi3GXnCN0Cl/view?usp=drivesdk",
  },
  {
    id: 43,
    bank: "Incred Finance",
    url: "https://pl.incred.com/open-market-sales/welcome-screen",
  },
];
 
const Banks = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="w-full bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#1E3A8A] p-4">
          <h1 className="text-white text-2xl font-bold">Bank Resources</h1>
        </div>
 
        {/* Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#12B99C] text-white">
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Bank Name</th>
              <th className="py-3 px-4 text-left">URL</th>
            </tr>
          </thead>
          <tbody>
            {bankData.map((bank, index) => (
              <tr
                key={bank.id}
                className={`${
                  index % 2 === 0 ? "bg-[#F8FAFC]" : "bg-white"
                } hover:bg-[#F59E0B]/20 transition`}
              >
                <td className="py-3 px-4 text-[#111827] font-medium">
                  {bank.id}
                </td>
                <td className="py-3 px-4 text-[#111827]">{bank.bank}</td>
                <td className="py-3 px-4">
                  <a
                    href={bank.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1E3A8A] font-semibold hover:underline"
                  >
                    {bank.url}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
 
export default Banks;