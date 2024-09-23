import { MoreVertical } from "lucide-react";

export default function Component() {
  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-md bg-white hover:shadow-xl">
      <a href="/detailCourse">
      <div className="relative h-36 bg-green-100">
        <img
          src="./src/assets/login.jpg"
          alt="Online learning illustration"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="px-6 py-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-bold text-xl mb-2 text-gray-800">
              TITLE TEST
            </h2>
            <p className=" text-sm">
              2024-2025 HỌC KỲ 1 - ĐẠI HỌC CHÍNH QUY
            </p>
          </div>
          {/* <button className=" hover:text-blue-600">
            <MoreVertical className="h-5 w-5" />
          </button> */}
        </div>
      </div>
      </a>
    </div>
  );
}