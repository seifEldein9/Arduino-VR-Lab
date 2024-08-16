using UnityEngine;

public class LEDScript : MonoBehaviour
{
    public WireConnection wireConnection;  // مرجع إلى سكربت التوصيلات
    public Light pointLight;                // مصدر الإضاءة لمحاكاة إضاءة LED

    void Start()
    {
        // التأكد من أن مكون Light تم تعيينه بشكل صحيح
        if (pointLight == null)
        {
            Debug.LogError("No Light component assigned. Please assign a Light component in the Inspector.");
            return;
        }

        // إعدادات مبدئية للإضاءة
        pointLight.type = LightType.Point;
        pointLight.range = 1.0f;            // مدى الضوء
        pointLight.intensity = 0.0f;        // الإضاءة مبدئيًا مطفأة
        pointLight.color = Color.yellow;    // لون الضوء (يمكن تغييره حسب الرغبة)
    }

    void Update()
    {
        // التحقق من أن كل من الأطراف الموجبة والسالبة متصلة بشكل صحيح
        bool positiveConnected = IsCorrectlyConnected(wireConnection.positiveTerminal, wireConnection.ledPositivePin);
        bool negativeConnected = IsCorrectlyConnected(wireConnection.negativeTerminal, wireConnection.ledNegativePin);

        if (positiveConnected && negativeConnected)
        {
            pointLight.intensity = 1.0f;  // إضاءة LED عند التوصيل الصحيح
            // Debug.Log("LED is on.");
        }
        else
        {
            pointLight.intensity = 0.0f;  // إطفاء LED إذا لم يتم توصيله بشكل صحيح
            // Debug.Log("LED is off.");
        }
    }

    bool IsCorrectlyConnected(Transform batteryTerminal, Transform ledPin)
    {
        // التحقق من الاتصال الصحيح بين الطرف والـ LED
        LineRenderer[] wires = FindObjectsOfType<LineRenderer>();
        foreach (LineRenderer wire in wires)
        {
            if ((wire.GetPosition(0) == batteryTerminal.position && wire.GetPosition(1) == ledPin.position) ||
                (wire.GetPosition(1) == batteryTerminal.position && wire.GetPosition(0) == ledPin.position))
            {
                return true;
            }
        }
        return false;
    }
}
