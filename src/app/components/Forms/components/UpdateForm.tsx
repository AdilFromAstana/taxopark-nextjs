import { Form } from "@/app/interfaces/interfaces";
import { memo } from "react";

const formTypes = {
  taxiPark: "Таксопарк",
  consultation: "Консультация",
};

interface UpdateFormProps {
  setIsViewEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRecord: Form;
}

const UpdateForm: React.FC<UpdateFormProps> = memo(
  ({ setIsViewEditModalOpen, selectedRecord }) => {
    const createdAt = selectedRecord.createdAt
      ? new Date(selectedRecord.createdAt).toLocaleString("ru-RU", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : "Нет данных";

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-[33vw] p-6">
          <h2 className="text-xl font-bold mb-4">Просмотр заявки</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">ФИО</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2 h-10"
                  value={selectedRecord.name}
                  disabled
                />
              </div>
              {selectedRecord.formType === "taxiPark" && (
                <div className="w-full">
                  <label className="block text-sm font-medium mb-1">
                    Таксопарк
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-2 h-10"
                    value={selectedRecord?.Park?.title}
                    disabled
                  />
                </div>
              )}
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">
                  Тип заявки
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2 h-10"
                  value={formTypes[selectedRecord.formType]}
                  disabled
                />
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">
                  Номер телефона
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2 h-10"
                  value={selectedRecord.phoneNumber}
                  disabled
                />
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">
                  Время отппрвки
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2 h-10"
                  value={createdAt}
                  disabled
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
                onClick={() => setIsViewEditModalOpen(false)}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

UpdateForm.displayName = "UpdateForm";

export default UpdateForm;
