using UnityEngine;

public class LightControl : MonoBehaviour
{
    public Light controlledLight; 
    private bool isLightOn = true; 

    void Update()
    {
 
        if (Input.GetKeyDown(KeyCode.Q))
        {
            ToggleLight();
        }
    }

    void ToggleLight()
    {
        if (controlledLight != null)
        {
            isLightOn = !isLightOn;
            controlledLight.enabled = isLightOn; 
            Debug.Log("Light is " + (isLightOn ? "on" : "off"));
        }
        else
        {
            Debug.LogWarning("No light assigned to control.");
        }
    }
}
