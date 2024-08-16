using UnityEngine;
using UnityEngine.EventSystems;

public class DragAndDrop : MonoBehaviour, IBeginDragHandler, IDragHandler, IEndDragHandler
{
    public GameObject prefabToInstantiate; // الـ Prefab المراد إنشاؤه عند الإفلات
    public GameObject placementSurface; // السطح الذي يسمح بالإفلات عليه

    private Vector3 startPosition;
    private Transform originalParent;

    public void OnBeginDrag(PointerEventData eventData)
    {
        startPosition = transform.position;
        originalParent = transform.parent;
        transform.SetParent(transform.root); // نفصل العنصر عن التسلسل الهيكلي لتجنب مشاكل UI
    }

    public void OnDrag(PointerEventData eventData)
    {
        UpdateDragPosition();
    }

    public void OnEndDrag(PointerEventData eventData)
    {
        transform.SetParent(originalParent); // إعادة العنصر لمكانه
        if (IsPointerOverPlacementSurface())
        {
            PlaceObject();
        }
        else
        {
            transform.position = startPosition; // إعادة العنصر لمكانه إذا لم يكن هناك وضع
        }
    }

    void UpdateDragPosition()
    {
        Vector3 mousePosition = Input.mousePosition;
        mousePosition.z = 10f; // تعيين البُعد Z ليكون أمام الكاميرا
        Vector3 worldMousePosition = Camera.main.ScreenToWorldPoint(mousePosition);

        // تحديث موقع القطعة بناءً على موقع الماوس على السطح
        Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
        RaycastHit hit;
        if (Physics.Raycast(ray, out hit))
        {
            if (hit.transform.gameObject == placementSurface)
            {
                transform.position = hit.point;
            }
        }
    }

    void PlaceObject()
    {
        if (prefabToInstantiate != null)
        {
            Vector3 mousePosition = Input.mousePosition;
            mousePosition.z = 10f;
            Vector3 spawnPosition = Camera.main.ScreenToWorldPoint(mousePosition);

            // تعديل موضع الإسقاط بحيث يتم على سطح الطاولة فقط
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            RaycastHit hit;
            if (Physics.Raycast(ray, out hit))
            {
                if (hit.transform.gameObject == placementSurface)
                {
                    spawnPosition = hit.point;
                    Instantiate(prefabToInstantiate, spawnPosition, Quaternion.identity);
                    Debug.Log("Object instantiated at: " + spawnPosition);
                }
            }
        }
    }

    bool IsPointerOverPlacementSurface()
    {
        // إجراء Raycast للتحقق مما إذا كان الماوس فوق السطح الصحيح
        Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
        RaycastHit hit;
        if (Physics.Raycast(ray, out hit))
        {
            return hit.transform.gameObject == placementSurface;
        }
        return false;
    }
}
