using UnityEngine;

public class WireConnection : MonoBehaviour
{
    public Transform positiveTerminal; // القطب الموجب للبطارية
    public Transform negativeTerminal; // القطب السالب للبطارية
    public Transform ledPositivePin;   // الطرف الموجب للـ LED
    public Transform ledNegativePin;   // الطرف السالب للـ LED

    private LineRenderer currentWire;  // السلك الحالي الذي يتم رسمه
    private bool isDrawing = false;    // حالة الرسم

    void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
            // بدء رسم السلك عند النقر على أحد أطراف البطارية
            if (CheckForDrawingStart(positiveTerminal) || CheckForDrawingStart(negativeTerminal))
            {
                isDrawing = true;
            }
        }

        if (isDrawing)
        {
            // تحديث موقع نهاية السلك إلى موضع الماوس
            Vector3 mousePosition = GetMouseWorldPosition();
            if (currentWire != null)
            {
                currentWire.SetPosition(1, mousePosition);
            }
        }

        if (Input.GetMouseButtonUp(0) && isDrawing)
        {
            // إتمام الرسم عند الإفلات والتحقق من التوصيل
            StopDrawingWire(ledPositivePin, ledNegativePin);
            isDrawing = false;
        }
    }

    bool CheckForDrawingStart(Transform terminal)
    {
        Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
        RaycastHit hit;
        if (Physics.Raycast(ray, out hit) && hit.transform == terminal)
        {
            currentWire = CreateWire();
            currentWire.SetPosition(0, terminal.position);
            currentWire.SetPosition(1, terminal.position);
            return true;
        }
        return false;
    }

    void StopDrawingWire(Transform pin1, Transform pin2)
    {
        if (currentWire == null) return;

        Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
        RaycastHit hit;
        if (Physics.Raycast(ray, out hit))
        {
            if (hit.transform == pin1 || hit.transform == pin2)
            {
                // إذا كان الطرف المناسب متصلاً، أتم الرسم
                currentWire.SetPosition(1, hit.transform.position);
            }
            else
            {
                // حذف السلك إذا لم يتم توصيله بالطرف المناسب
                Destroy(currentWire.gameObject);
            }
        }
    }

    LineRenderer CreateWire()
    {
        GameObject wireObject = new GameObject("Wire");
        LineRenderer wire = wireObject.AddComponent<LineRenderer>();
        wire.startWidth = 0.02f;
        wire.endWidth = 0.02f;
        wire.positionCount = 2;
        wire.useWorldSpace = true;
        wire.material = new Material(Shader.Find("Sprites/Default"));
        return wire;
    }

    Vector3 GetMouseWorldPosition()
    {
        Vector3 mousePosition = Input.mousePosition;
        mousePosition.z = 10f; // قم بتعيين بُعد Z ليكون أمام الكاميرا
        return Camera.main.ScreenToWorldPoint(mousePosition);
    }
}
