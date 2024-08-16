using UnityEngine;
using System.Collections.Generic;

public class ConnectSquares : MonoBehaviour
{
    public GameObject mainSquare;  // المربع الرئيسي
    public GameObject[] connectedSquares;  // المربعات المتصلة
    private bool isDragging = false;  // حالة السحب
    private LineRenderer currentLineRenderer;  // لرسم الخط الحالي
    private List<LineRenderer> lines = new List<LineRenderer>();  // قائمة بالخطوط المرسومة

    void Update()
    {
        if (Input.GetMouseButtonDown(0)) // عند النقر على زر الماوس الأيسر
        {
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            RaycastHit hit;
            
            if (Physics.Raycast(ray, out hit))
            {
                if (hit.transform.gameObject == mainSquare)
                {
                    isDragging = true;  // بدء السحب
                    CreateLineRenderer();  // إنشاء LineRenderer جديد للخط الجديد
                }
            }
        }

        if (Input.GetMouseButton(0) && isDragging) // أثناء السحب
        {
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            Plane plane = new Plane(Vector3.up, 0);
            float distance;
            if (plane.Raycast(ray, out distance))
            {
                Vector3 point = ray.GetPoint(distance);
                currentLineRenderer.SetPosition(0, mainSquare.transform.position);
                currentLineRenderer.SetPosition(1, point);
            }
        }

        if (Input.GetMouseButtonUp(0) && isDragging) // عند رفع الزر الأيسر للماوس
        {
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            RaycastHit hit;

            if (Physics.Raycast(ray, out hit))
            {
                foreach (var square in connectedSquares)
                {
                    if (hit.transform.gameObject == square)
                    {
                        currentLineRenderer.SetPosition(1, square.transform.position);  // رسم الخط إلى المربع المتصل
                        break;
                    }
                }
            }

            isDragging = false;  // إنهاء السحب
        }
    }

    void CreateLineRenderer()
    {
        // إنشاء LineRenderer جديد وإعداده
        GameObject lineObject = new GameObject("Line");
        currentLineRenderer = lineObject.AddComponent<LineRenderer>();
        currentLineRenderer.startWidth = 0.05f;
        currentLineRenderer.endWidth = 0.05f;
        currentLineRenderer.positionCount = 2;
        currentLineRenderer.useWorldSpace = true;
        currentLineRenderer.material = new Material(Shader.Find("Sprites/Default"));
        
        // إضافة الخط الجديد إلى قائمة الخطوط
        lines.Add(currentLineRenderer);
    }
}
