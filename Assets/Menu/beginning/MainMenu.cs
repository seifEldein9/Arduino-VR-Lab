using UnityEngine;
using UnityEngine.UI;

public class GameStartMenu : MonoBehaviour
{
    public GameObject startMenuUI; // واجهة المستخدم للمنيو
    public GameObject[] gameComponents; // مكونات اللعبة التي سيتم تفعيلها عند بدء اللعبة
    public Button startButton; // زر البداية
    public Button exitButton; // زر الإغلاق

    void Start()
    {
        // إظهار المنيو عند بدء اللعبة
        startMenuUI.SetActive(true);
        SetGameComponentsActive(false); // تعطيل مكونات اللعبة
        Time.timeScale = 0f; // إيقاف الوقت لمنع أي حركات في اللعبة

        // إضافة الأحداث للأزرار
        startButton.onClick.AddListener(StartGame);
        exitButton.onClick.AddListener(ExitGame);
    }

    // وظيفة زر "Start"
    public void StartGame()
    {
        Debug.Log("Start button pressed"); // تحقق من الضغط على الزر
        startMenuUI.SetActive(false); // إخفاء المنيو
        SetGameComponentsActive(true); // تفعيل مكونات اللعبة
        Time.timeScale = 1f; // استئناف الوقت
    }

    // وظيفة زر "Exit"
    public void ExitGame()
    {
        Debug.Log("Game is exiting...");
        Application.Quit(); // إغلاق اللعبة
    }

    // تفعيل أو تعطيل مكونات اللعبة
    private void SetGameComponentsActive(bool isActive)
    {
        foreach (GameObject component in gameComponents)
        {
            if (component != null)
            {
                Debug.Log("Setting component active: " + component.name + " to " + isActive);
                component.SetActive(isActive);
            }
            else
            {
                Debug.LogWarning("One of the game components is null");
            }
        }
    }
}
