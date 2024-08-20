using UnityEngine;

public class LightControl : MonoBehaviour
{
    public Light controlledLight; // مصدر الضوء الذي نريد التحكم فيه
    private bool isLightOn = true; // حالة الضوء، يبدأ مفعلًا

    void Update()
    {
        // التبديل بين تشغيل وإيقاف الضوء عند الضغط على زر Q
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
            controlledLight.enabled = isLightOn; // تشغيل أو إيقاف الضوء بناءً على الحالة
            Debug.Log("Light is " + (isLightOn ? "on" : "off"));
        }
        else
        {
            Debug.LogWarning("No light assigned to control.");
        }
    }
}
