using UnityEngine;
using UnityEngine.UI;

public class InventoryMenu : MonoBehaviour
{
    public GameObject inventoryPanel; // لوحة القائمة
    private bool isMenuOpen = false;  // حالة القائمة

    void Start()
    {
        // التأكد من أن القائمة مغلقة في البداية
        inventoryPanel.SetActive(false);
    }

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.E))
        {
            ToggleMenu();
        }
    }

    void ToggleMenu()
    {
        isMenuOpen = !isMenuOpen;
        inventoryPanel.SetActive(isMenuOpen);
    }
}
