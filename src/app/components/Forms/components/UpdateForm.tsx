import { Form } from "@/app/interfaces/interfaces";

interface UpdateFormProps {
    setIsViewEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isEditMode: boolean;
    setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    selectedRecord: Form;
    setSelectedRecord: React.Dispatch<React.SetStateAction<Form | null>>;
    forms: Form[];
    handleEditRecord: () => void;
}

const UpdateForm: React.FC<UpdateFormProps> = ({
    setIsViewEditModalOpen,
    isEditMode,
    setIsEditMode,
    selectedRecord,
    setSelectedRecord,
    forms,
    handleEditRecord,
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[33vw] p-6">
                <h2 className="text-xl font-bold mb-4">
                    {isEditMode ? "Редактировать таксопарк" : "Просмотр таксопарка"}
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Название</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg p-2"
                            value={selectedRecord.name}
                            onChange={(e) =>
                                setSelectedRecord({
                                    ...selectedRecord,
                                    title: e.target.value,
                                })
                            }
                            disabled={!isEditMode}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Город</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg p-2"
                            value={selectedRecord.cityId}
                            onChange={(e) =>
                                setSelectedRecord({
                                    ...selectedRecord,
                                    cityId: e.target.value,
                                })
                            }
                            disabled={!isEditMode}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Комиссия парка
                        </label>
                        <input
                            type="number"
                            className="w-full border border-gray-300 rounded-lg p-2"
                            value={selectedRecord.formCommission ?? 0}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    setSelectedRecord({
                                        ...selectedRecord,
                                        formCommission: value === "" ? null : Number(value), // Если пустая строка, устанавливаем null
                                    });
                                }
                            }}
                            disabled={!isEditMode}
                        />
                    </div>
                    {/* <div>
            <label className="block text-sm font-medium mb-1">Бонусы</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={selectedRecord.bonuses}
              onChange={(e) =>
                setSelectedRecord({
                  ...selectedRecord,
                  bonuses: e.target.value,
                })
              }
              disabled={!isEditMode}
            />
          </div> */}
                    <div className="flex justify-between space-x-2">
                        {isEditMode ? (
                            <>
                                <button
                                    className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-500 transition duration-200"
                                    onClick={handleEditRecord}
                                >
                                    Сохранить
                                </button>
                                <button
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
                                    onClick={() => {
                                        setIsEditMode(false);
                                        const updatedForm = forms.find(
                                            (item) => item.id === selectedRecord.id
                                        );
                                        if (updatedForm) {
                                            setSelectedRecord(updatedForm);
                                        }
                                    }}
                                >
                                    Отмена
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                                    onClick={() => setIsEditMode(true)}
                                >
                                    Редактировать
                                </button>
                                <button
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
                                    onClick={() => setIsViewEditModalOpen(false)}
                                >
                                    Закрыть
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default UpdateForm;
