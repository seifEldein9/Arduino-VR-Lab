using UnityEngine;
using UnityEngine.EventSystems;

public class DragAndDrop : MonoBehaviour, IBeginDragHandler, IDragHandler, IEndDragHandler
{
    public GameObject prefabToInstantiate; 
    public GameObject placementSurface; 

    private Vector3 startPosition;
    private Transform originalParent;

    public void OnBeginDrag(PointerEventData eventData)
    {
        startPosition = transform.position;
        originalParent = transform.parent;
        transform.SetParent(transform.root); 
    }

    public void OnDrag(PointerEventData eventData)
    {
        UpdateDragPosition();
    }

    public void OnEndDrag(PointerEventData eventData)
    {
        transform.SetParent(originalParent); 
        if (IsPointerOverPlacementSurface())
        {
            PlaceObject();
        }
        else
        {
            transform.position = startPosition; 
        }
    }

    void UpdateDragPosition()
    {
        Vector3 mousePosition = Input.mousePosition;
        mousePosition.z = 10f;
        Vector3 worldMousePosition = Camera.main.ScreenToWorldPoint(mousePosition);

        
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
       
        Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
        RaycastHit hit;
        if (Physics.Raycast(ray, out hit))
        {
            return hit.transform.gameObject == placementSurface;
        }
        return false;
    }
}
