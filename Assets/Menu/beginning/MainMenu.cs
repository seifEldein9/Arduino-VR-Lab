using UnityEngine;
using UnityEngine.UI;

public class GameStartMenu : MonoBehaviour
{
    public GameObject startMenuUI; 
    public GameObject[] gameComponents;  
    public Button startButton;  
    public Button exitButton;  

    void Start()
    {
   
        startMenuUI.SetActive(true);
        SetGameComponentsActive(false); 
        Time.timeScale = 0f; 

         
        startButton.onClick.AddListener(StartGame);
        exitButton.onClick.AddListener(ExitGame);
    }

  
    public void StartGame()
    {
        Debug.Log("Start button pressed");  
        startMenuUI.SetActive(false);  
        SetGameComponentsActive(true);  
        Time.timeScale = 1f;  
    }

    
    public void ExitGame()
    {
        Debug.Log("Game is exiting...");
        Application.Quit(); 
    }

   
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
